import type { availableGameT } from "../type/availableGameType";

export function createFakeGame(): availableGameT[] {
  return [
    {
      id: 0,
      code: "phil123",
      type: "friend",
	  is_friend:true,
      nb_player: 6,
      max_player: 7,
      list_player: [
        {
          username: "philou",
		  id: 0,
        },
        {
          username: "phistule",
		  id: 1,
        },
        {
          username: "philipe",
		  id: 3,
        },
        {
          username: "phibonacci",
		  id: 2,
        },
        {
          username: "phiphi",
		  id: 4,
        },
        {
          username: "phuck",
		  id: 5,
        },
      ],
      host: {id: 66, username: "John"},
    },
    {
      id: 1,
      code: "fred123",
      type: "friend",
	  is_friend:true,
      max_player: 4,
      nb_player: 4,
      list_player: [
        {
          username: "fredo",
		  id: 6,
        },
        {
          username: "frederic",
		  id: 7,
        },
        {
          username: "fredouane",
		  id: 8,
        },
        {
          username: "fredpayment",
		  id: 9,
        },
      ],
      host: {username: "frederic", id: 67},
    },
    {
      id: 2,
      code: "anne123",
      type: "public",
	  is_friend:true,
      max_player: 5,
      nb_player: 3,
      list_player: [
        {
          username: "anna",
		  id: 10,
        },
        {
          username: "annesthesie",
		  id: 11,
        },
        {
          username: "annick",
		  id: 12,
        },
      ],
      host: {username: "anna", id:3},
    },
    {
      id: 3,
      code: "clem123",
      type: "friend",
	  is_friend:true,
      max_player: 6,
      nb_player: 4,
      list_player: [
        {
          username: "clemence",
		  id: 13,
        },
        {
          username: "clementine",
		  id: 14,
        },
        {
          username: "clement",
		  id: 15,
        },
        {
          username: "clemercestcquiyadplubo",
		  id: 16,
        },
      ],
      host: {username: "sorry there were too many to reproduce, so now they're copied and pasted", id:68},
    },
    {
      id: 4,
      code: "clem123",
      type: "friend",
	  is_friend:true,
      max_player: 6,
      nb_player: 4,
      list_player: [
        {
          username: "clemence",
		  id: 13,
        },
        {
          username: "clementine",
		  id: 14,
        },
        {
          username: "clement",
		  id: 15,
        },
        {
          username: "clemercestcquiyadplubo",
		  id: 16,
        },
      ],
      host: {username: "sorry there were too many to reproduce, so now they're copied and pasted", id:68},
    },
        {
      id: 5,
      code: "clem123",
      type: "friend",
	  is_friend:true,
      max_player: 6,
      nb_player: 4,
      list_player: [
        {
          username: "clemence",
		  id: 13,
        },
        {
          username: "clementine",
		  id: 14,
        },
        {
          username: "clement",
		  id: 15,
        },
        {
          username: "clemercestcquiyadplubo",
		  id: 16,
        },
      ],
      host: {username: "sorry there were too many to reproduce, so now they're copied and pasted", id:68},
    },
    {
      id: 6,
      code: "clem123",
      type: "friend",
	  is_friend:true,
      max_player: 6,
      nb_player: 4,
      list_player: [
        {
          username: "clemence",
		  id: 13,
        },
        {
          username: "clementine",
		  id: 14,
        },
        {
          username: "clement",
		  id: 15,
        },
        {
          username: "clemercestcquiyadplubo",
		  id: 16,
        },
      ],
      host: {username: "sorry there were too many to reproduce, so now they're copied and pasted", id:68},
    },
  ];
}
