export class RegisterCommand {
  constructor(
    private firstName: string,
    private email: string,
    private password: string
  ) {}

  async execute() {
    const dataToSend = JSON.stringify({
      first_name: this.firstName,
      email: this.email,
      password: this.password,
      
    });

    const response = await fetch('http://localhost:5296/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dataToSend,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registrierung fehlgeschlagen');
    }

    const responseData = await response.json();
    return responseData;
  }
}
