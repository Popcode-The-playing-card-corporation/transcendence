export function Rules() {
  return (
    <div className="page-content mt-17">
      <h1>Rules</h1>
      <div className="mt-10">
		<p>"La misère" is a variant of the Swiss game known as Jass. It is a trick taking game played with 36 cards</p>
        <h2 className="mt-4">Setup</h2>
		<p>A player deals the cards in a counter-clockwise fashion until no more cards remain in the deck, or there they can no longer be evenly distributed. The remaining cards are kept hidden.</p>
        <div>
          <h2 className="mt-4">The Game</h2>
		  <p>
            The player who's hand contains the 7 of diamonds, will play the first card. They may play any card they wish. Play continues in a counter-clockwise direction.
			Once a player plays their first card, they may announce outloud that they have an "annonce" within their hand (except for the "Stöck"). The points gained will be deducted from their score and at the end of the round they will show their announced cards.
			Once each player has played a card, the strongest card wins the trick. If there is an "annonce" on the table, the corresponding points are added to the score of the player who won the trick.
			The player will then keep the trick in order to be able to count their points at the end of the round.
			Once all the players have played all their cards, all that remains is to total each of their points.
			Note that the player who wins the last trick will gain an additional 5 points.
			The dealer then becomes the person who started play during the first turn of the round, and the person on the right will then play first.
			As many rounds as agreed upon may be played. The winner will be the player with the least points.
          </p>
		  <h2 className="mt-4">The Trump Suit</h2>
		  <p>
            The Trump suit also known as the "atout" is decided dynamically for each round.
			The first player to "coup" also known as to trump in will decide what the trump suit is, based off of the suit of the card that they play.
			While the trump suit is undecided, a player may only trump in if they do not have the suit that has been requested for the turn. Otherwise they have to play the requested suit.
			Once the suit is decided a player may trump in at any time, provided that they play a more powerful trump than one that has been already played.
			When a trump is the first card played it becomes the requested suit, here players may play less powerful trumps than what have been already played.
			In any case, only when a player does not have a card of the requested suit may they play a non-trump card of a different suit.
			The Buur (Jack of Trumps) is exempt from all of these rules, the player who holds this card cannot be forced to play it, unless of course it is their last card.
          </p>
          <h2 className="mt-4">The "annonces"</h2>
        </div>
		<p>There are many different "annonces" that will give a corresponding amount of points: </p>
        <table className="border-2 border-accent table mt-3 bg-base-100">
          <thead className="text-lg ">
            <tr>
              <th>Annonce</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stöck (King and Queen of the trump suit)</td>
              <td>20</td>
            </tr>
            <tr>
              <td>A 3 card suite of the same colour</td>
              <td>20</td>
            </tr>
            <tr>
              <td>A 4 card suite of the same colour</td>
              <td>50</td>
            </tr>
            <tr>
              <td>A 5 card suite of the same colour</td>
              <td>150</td>
            </tr>
            <tr>
              <td>4 of a kind</td>
              <td>100</td>
            </tr>
            <tr>
              <td>4 of a kind of the "Nell" (all the 9s)</td>
              <td>150</td>
            </tr>
            <tr>
              <td>4 of a kind of the "Buur" (all the jacks)</td>
              <td>200</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-7">Point Calculation</h2>
        <table className="border-2 border-accent table mt-3 bg-base-100">
          <thead className="text-lg">
            <tr >
              <th>Card</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>6 to 9</td>
              <td>0</td>
            </tr>
            <tr>
              <td>10</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Jack</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Queen</td>
              <td>3</td>
            </tr>
            <tr>
              <td>King</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Ace</td>
              <td>11</td>
            </tr>
            <tr>
              <td>Nell (9 of the trump suit)</td>
              <td>14</td>
            </tr>
            <tr>
              <td>Buur (Jack of the trump suit)</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Taking the last trick</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
