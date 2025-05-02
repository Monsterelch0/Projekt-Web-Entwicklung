// src/commands/LoginCommand.ts
export class LoginCommand {
  constructor(private email: string, private password: string) {}

  async execute() {
    //  Validate input
    const dataToSend = JSON.stringify({
      email: this.email,
      password: this.password,
    });

    // Send data to the server
    console.log('Sende folgende Daten an den Server:', dataToSend);

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dataToSend,
    });

    if (!response.ok) {
      throw new Error('Login fehlgeschlagen');
    }

    const responseData = await response.json();

    // Answer from Server
    console.log('Empfangene JSON-Antwort vom Server:', responseData);


    return responseData;
  }
}