import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateGroupValidator {
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
  })

  public messages = {
    'name.required': 'Group name is required',
    'name.maxLength': 'Group name is too long',
  }
}
