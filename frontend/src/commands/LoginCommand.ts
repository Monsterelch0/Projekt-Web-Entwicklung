import { API_URL } from "../constants";

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
    try {
      const response = await fetch(``, {
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
    } catch (error) { 
    }
  }
}