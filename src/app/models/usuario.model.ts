export class Usuario {
  static fromFirebase({ userId, nombre, email }) {
    return new Usuario(userId, nombre, email);
  }
  constructor(
    public userId: string,
    public nombre: string,
    public email: string
  ) {}
}
