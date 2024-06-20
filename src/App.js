import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [addFriend, setAddFriend] = useState(false);
  const [addBill, setAddBill] = useState(null);

  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setAddFriend(false);
  }
  return (
    <div>
      <h1>Split Bill With Friends</h1>
      <div className="app">
        <div className="sidebar">
          <FriendsList
            addBill={addBill}
            setAddBill={setAddBill}
            friends={friends}
          />

          {addFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button onclick={() => setAddFriend(!addFriend)}>
            {!addFriend ? "Add" : "Close"}
          </Button>
        </div>

        {addBill && <FormSplitBill id={addBill} form={friends} key={addBill} />}
      </div>
    </div>
  );
}

function FriendsList({ addBill, setAddBill, friends }) {
  return (
    <ul>
      {friends.map((curr) => (
        <Friend
          friend={curr}
          addBill={addBill}
          setAddBill={setAddBill}
          key={curr.id}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, setAddBill }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      {friend.balance > 0 && (
        <p className="green">
          Your friend {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}

      <Button onclick={() => setAddBill(friend.id)}>Add</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>1. Name: </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>2. URL: </label>
      <input
        type="text"
        value={img}
        placeholder=""
        onChange={(e) => setImg(e.target.value)}
      />

      <Button>Save</Button>
    </form>
  );
}

function FormSplitBill({ id, form }) {
  const currentDetail = form.filter((curr) => curr.id === id).pop();

  const [value, setValue] = useState(0);
  const [my, setMy] = useState(0);
  const [their, setTheir] = useState(0);
  const [paid, setPaid] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(currentDetail.balance);
    if (my + their !== value) {
      return alert("Your total does not match");
    }
    if (paid === "user") {
      currentDetail.balance += my;
    } else {
      currentDetail.balance -= their;
    }
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split the bill with {currentDetail.name}</h2>
      <label>1. Bill Value:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <label>2. Your Expense:</label>
      <input
        type="number"
        value={my}
        onChange={(e) => setMy(Number(e.target.value))}
      />
      <label>3. Their Expense:</label>
      <input
        type="number"
        value={their}
        onChange={(e) => setTheir(Number(e.target.value))}
      />
      <label>4. Who Paid: </label>
      <select value={paid} onChange={(e) => setPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{currentDetail.name}</option>
      </select>

      <Button>Submit</Button>
    </form>
  );
}
function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}
