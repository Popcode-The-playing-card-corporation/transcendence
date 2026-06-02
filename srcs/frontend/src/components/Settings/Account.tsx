export default function Account() {
  return (
    <div>
      <div className="flex flex-col w-1/3 mx-auto gap-4">
        <h3>Personnal information</h3>
        <button className="btn">Change password</button>
        <button className="btn">Change email</button>
        <button className="btn">Change Username</button>
      </div>
	  <div>
	  <h3>Privacy and Security</h3>
	  <p>Not implemented, fucked you (and the capitalism btw)</p>
	  </div>
    </div>
  );
}
