USER_CONDITIONS = {
    "elo": lambda user: user.elo,
    "clovers": lambda user: user.clovers,
    "win": lambda user: user.stat.win,
    "lose": lambda user: user.stat.lose,
    "nb_host": lambda user: user.stat.nb_host,
    "account_created": lambda user: 1,
    "friends": lambda user: (
        user.sent_friendships.filter(status="accepted").count()
        +
        user.received_friendships.filter(status="accepted").count()
    ),
}


#def check_buur_and_neil(user, context):
#    game_state = context["game_state"]
#    trick = context["trick"]
#
#    has_buur = False
#    has_neil = False
#
#    for card in game_state["taken"]:
#        if card.value == "J" and card.color == trick:
#            has_buur = True
#        if card == "9" and card.color == trick:
#            has_neil = True
#
#    return has_buur and has_neil
#
#GAME_CONDITIONS = {
#    "buur_and_neil": check_buur_and_neil,
#}
