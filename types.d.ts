interface User {
  id?: string
  username: string
  passwd: string
  email: string
}

type Username = Pick<User, 'username'>
type Password = Pick<User, 'passwd'>
type UserID = Pick<User, 'id'>
type UserLogin = Pick<User, 'username' | 'passwd'>
type UserInfo = Pick<User, 'username' | 'email'>

interface ErrorDB {
  message: string;
  code:number;
}

interface Card {
  id: string
  title: string
  content: string
  section_id: string
}

interface Section {
  id: string
  title: string
  user_id: string
  cards: Card[]
}
type SectionID = Pick<Section, 'id'>

interface UserData {
  sections: Section[]
}
