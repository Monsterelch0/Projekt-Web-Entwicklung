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
   

    const response = await fetch('https://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dataToSend,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }
    

    const responseData = await response.json();

    return responseData;
  }
}