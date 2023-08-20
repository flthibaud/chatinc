import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { onlineUsersService } from 'App/Services/OnlineUsersService'

import Message from 'App/Models/Message'

export default class MessagesController {
  public async storeMessage({ request, response }: HttpContextContract) {
    try {
      const { message, from, to } = request.body() // Récupère les paramètres de la requête
      const getUser = onlineUsersService.getUser(to) // Vérifie si l'utilisateur destinataire est en ligne

      if (message && from && to) {
        // Vérifie que tous les paramètres sont présents
        const newMessage = new Message()
        newMessage.message = message
        newMessage.senderId = from
        newMessage.receiverId = to
        newMessage.messageStatus = getUser ? 'delivered' : 'sent' // Définit le statut du message en fonction de l'état de connexion de l'utilisateur destinataire
        newMessage.messageType = 'text'

        await newMessage.save() // Enregistre le nouveau message dans la base de données

        return response.status(201).json(newMessage) // Renvoie le nouveau message créé
      } else {
        return response.status(400).json({ message: 'From, to and message is required' }) // Renvoie une erreur si les paramètres sont manquants
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' }) // Renvoie une erreur en cas d'erreur interne du serveur
    }
  }

  public async getMessages({ request, response }: HttpContextContract) {
    try {
      const { from, to } = request.qs() // Récupère les paramètres de la requête

      if (from && to) {
        // Vérifie que les deux paramètres sont présents
        const messages = await Message.query()
          .where((query) => {
            query.where('sender_id', from).andWhere('receiver_id', to)
          })
          .orWhere((query) => {
            query.where('sender_id', to).andWhere('receiver_id', from)
          }) // Récupère les messages entre les deux utilisateurs

        const unreadMessages = [] as number[] // Initialise un tableau pour stocker les messages non lus

        messages.forEach((message, index) => {
          if (message.messageStatus !== 'read' && message.senderId === parseInt(to)) {
            messages[index].messageStatus = 'read' // Met à jour le statut du message à "lu"
            unreadMessages.push(message.id) // Ajoute l'ID du message non lu au tableau
          }
        }) // Parcourt les messages pour trouver ceux qui n'ont pas été lus

        if (unreadMessages.length > 0) {
          await Message.query().whereIn('id', unreadMessages).update({ messageStatus: 'read' }) // Met à jour le statut des messages non lus dans la base de données
        }

        return response.status(200).json(messages) // Renvoie les messages récupérés
      } else {
        return response.status(400).json({ message: 'From and to is required' }) // Renvoie une erreur si les paramètres sont manquants
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' }) // Renvoie une erreur en cas d'erreur interne du serveur
    }
  }
}
