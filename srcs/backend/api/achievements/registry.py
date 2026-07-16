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

def get_condition_value(user, condition):
    source = condition.get("source")
    type_ = condition.get("type")

    if source == "user":
        return USER_CONDITIONS[type_](user)

    return 0
