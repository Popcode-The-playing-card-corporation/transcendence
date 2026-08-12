from ..models import EmailVerification
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import timedelta
from django.utils import timezone
from secrets import token_urlsafe
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from rest_framework.permissions import BasePermission
from django.core.mail import send_mail
from django.core.exceptions import ValidationError

class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.email_verified
        )

def create_code(user, verification):
	code = token_urlsafe(32)
	code_hash = make_password(code)
	verification.code_hash = code_hash
	verification.attempts = 0
	verification.expires_at = timezone.now() + timedelta(minutes=10)
	verification.last_sent = timezone.now()
	verification.save()

	return code

def check_code(input_code, verification):
	return (check_password(input_code, verification.code_hash))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_code(request):
	user = request.user

	if user.email_verified:
		return Response(
			{
				"error" : "This account is already verified"
			},
			status=400
		)	

	verification, created = EmailVerification.objects.get_or_create(user=user,
															defaults={
																"code_hash": "",
																"expires_at": timezone.now(),
																"last_sent": timezone.now(),
															})
		
	if not created and (timezone.now() - verification.last_sent).total_seconds() < 60:
		return Response(
			{
				"error" : "Wait 60 seconds before requests"
			},
			status=400
		)
	token = create_code(user, verification)

	verification_link = f"{settings.FRONTEND_URL}/verify_email?id={verification.search_id}&token={token}"
	send_mail(
		subject="POPCARDS: Verify your email",
		message=f"Verify your email by clicking this link:\n\n{verification_link}",
		from_email=settings.DEFAULT_FROM_EMAIL,
		recipient_list=[user.email],
		fail_silently=False,
	)
	return Response(
		{
			"success": "email sent",
		}
	)

@api_view(["POST"])
@permission_classes([AllowAny])
def validate_code(request):
	search_id = request.data.get("id")
	token = request.data.get("token")
	if not search_id or not token:
		return Response(
			{
				"error": "Invalid verification link"
			},
			status=400
		)
	try:
		verification = EmailVerification.objects.get(search_id=search_id)
	except (EmailVerification.DoesNotExist, ValidationError, ValueError):
		return Response(
			{
				"error": "Invalid or expired verification link"
			},
			status=400
		)
	user = verification.user
	if user.email_verified:
		return Response(
			{
				"error" : "This account is already verified"
			},
			status=400
		)	
	elif timezone.now() > verification.expires_at:
		return Response(
			{
				"error" : "Code expired"
			},
			status=400
		)
	elif (verification.attempts >= 5):
		return Response(
			{
				"error" : "Max attempts reached"
			},
			status=400
		)
	elif (not check_code(token, verification)):
		verification.attempts += 1
		verification.save(update_fields=["attempts"])
		return Response(
			{
				"error": "Incorrect code"
			},
			status=400
		)

	user.email_verified = True
	user.save(update_fields=["email_verified"])
	verification.delete()
	return Response(
		{
			"success": "code correct"
		}
	)