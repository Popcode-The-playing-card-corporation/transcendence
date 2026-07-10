from .operators import OPERATORS
from .registry import USER_CONDITIONS


def check_condition(user, condition):
    getter = USER_CONDITIONS.get(condition["type"])

    if getter is None:
        raise ValueError(f"Unknown condition type: {condition['type']}")

    value = getter(user)

    operator = OPERATORS[condition["operator"]]

    return operator(value, condition["value"])

def check(user, condition, context=None):
    if "all" in condition:
        return all(check(user, c) for c in condition["all"])

    if "any" in condition:
        return any(check(user, c) for c in condition["any"])

    return check_condition(user, condition)