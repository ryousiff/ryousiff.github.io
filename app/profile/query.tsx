import {AuditsData} from './Audits'
import {Progress} from './progress'
interface Skill {
  type: string;
  amount: number;
}
export interface Audit {
  totalUp: number;
  totalDown: number;
  auditRatio: number;
}

export interface UserData {
  firstName :string;
  id: string
  login: string
  skills: Skill[];
  audit : Audit; 
  email: string
  createdAt: string
  audits: AuditsData;
  progresses: Progress
}

export const query =  `
      query($userId: Int!, $eventId: Int!) {
user(where: {id: {_eq: $userId}}) {
 id
 login
 firstName
 lastName
 email
 auditRatio
 totalUp
 totalDown
 audits: audits_aggregate(
   where: {
     auditorId: {_eq: $userId},
     grade: {_is_null: false}
   },
   order_by: {createdAt: desc}
 ) {
   nodes {
     id
     grade
     createdAt
     group {
       captainLogin
       object {
         name
       }
     }
   }
 }
 progresses(where: { userId: { _eq: $userId }, object: { type: { _eq: "project" } } }, order_by: {updatedAt: desc}) {
   id
   object {
     id
     name
     type
   }
   grade
   createdAt
   updatedAt
 }
 skills: transactions(
   order_by: [{type: desc}, {amount: desc}]
   distinct_on: [type]
   where: {userId: {_eq: $userId}, type: {_in: ["skill_js", "skill_go", "skill_html", "skill_prog", "skill_front-end", "skill_back-end"]}}
 ) {
   type
   amount
 }
}
event_user(where: { userId: { _eq: $userId }, eventId: {_eq: $eventId}}) {
 level
}
}
   `

   