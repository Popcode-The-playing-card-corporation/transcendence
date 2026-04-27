class Card:
	def __init__(self, values, colors):
		self.values = values
		self.colors = colors
		self.cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}

	def __eq__(self, other):
		return self.values == other.values
	
	def __ne__(self, other):
		return self.values == other.values
	
	def __lt__(self, other):
		return self.cardValue[self.values] < self.cardValue[other.values]
	
	def __le__(self, other):
		return self.cardValue[self.values] <= self.cardValue[other.values]
	
	def __gt__(self, other):
		return self.cardValue[self.values] > self.cardValue[other.values]
	
	def __ge__(self, other):
		return self.cardValue[self.values] >= self.cardValue[other.values]
