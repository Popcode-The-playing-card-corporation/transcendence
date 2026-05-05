class Card:
	def __init__(self, values, colors, id=-1):
		self.values = values
		self.colors = colors
		self.id = id
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

	def __repr__(self):
		return f"value = {self.values} - color = {self.colors} - id = {self.id}\n"
