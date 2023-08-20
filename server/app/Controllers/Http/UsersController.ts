import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      // Récupère tous les utilisateurs de la base de données et les trie par ordre alphabétique de leur nom d'utilisateur
      const users = await User.query().orderBy('username', 'asc')

      // Crée un objet vide pour stocker les utilisateurs groupés par la première lettre de leur nom d'utilisateur
      const userGroupedByInitialLetter = {}

      // Boucle sur chaque utilisateur
      users.forEach((user) => {
        // Récupère la première lettre de l'utilisateur et la convertit en majuscule
        const initialLetter = user.username.charAt(0).toUpperCase()

        // Vérifie si la lettre initiale existe déjà comme clé dans l'objet userGroupedByInitialLetter
        if (!userGroupedByInitialLetter[initialLetter]) {
          // Si la lettre initiale n'existe pas, crée une nouvelle clé avec un tableau vide comme valeur
          userGroupedByInitialLetter[initialLetter] = []
        }

        // Ajoute l'utilisateur actuel au tableau correspondant à la lettre initiale
        userGroupedByInitialLetter[initialLetter].push(user)
      })

      // Retourne une réponse JSON avec un objet contenant les utilisateurs groupés par lettre initiale
      return response.status(200).json({ users: userGroupedByInitialLetter })
    } catch (error) {
      // Si une erreur se produit lors de la requête de la base de données ou du regroupement des utilisateurs, renvoie une réponse JSON avec un code d'état 500 et un message d'erreur
      return response.status(500).json({ message: error.message })
    }
  }
}
