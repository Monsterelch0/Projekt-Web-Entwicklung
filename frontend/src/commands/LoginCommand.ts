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
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dataToSend,
    });
    // Check the response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }
    
    const responseData = await response.json();

    return responseData;
  }
}