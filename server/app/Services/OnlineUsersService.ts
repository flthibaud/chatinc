export default class OnlineUsersService {
  // Création d'une Map pour stocker les utilisateurs en ligne
  private users: Map<number, string> = new Map() // Associe l'ID de l'utilisateur au socketId

  // Ajouter un utilisateur à la Map
  public addUser(userId: number, socketId: string) {
    this.users.set(userId, socketId)
  }

  // Supprimer un utilisateur de la Map
  public removeUser(id: number) {
    this.users.delete(id)
  }

  // Récupérer le socketId d'un utilisateur en fonction de son id
  public getUser(id: number) {
    return this.users.get(id)
  }

  // Récupérer tous les utilisateurs de la Map
  public getUsers() {
    return this.users
  }
}

// Exporter une instance de la classe OnlineUsersService
export const onlineUsersService = new OnlineUsersService()
