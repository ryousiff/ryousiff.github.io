'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { query } from './query'
import { UserData } from './query'
import SkillsPieChart from "./skills"
import AuditRatioChart from "./auditRatio"
import DisplayAudits from "./Audits"
import DisplayProgress from "./progress"

function GetUserIdFromToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && payload.sub) {
      return parseInt(payload.sub, 10);
    }
    throw new Error('User ID not found in token');
  } catch (error) {
    console.error('Error parsing token:', error);
    throw new Error('Invalid token structure');
  }
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login')
      return
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query,
            variables: {
              userId: GetUserIdFromToken(token),
              eventId: 20
            }
          })
        })

        const data = await response.json()
        const user = data.data.user[0]

        if (user) {
          setUserData({
            ...user,
            audit: {
              totalUp: user.totalUp,
              totalDown: user.totalDown,
              auditRatio: user.auditRatio
            },
            audits: {
              nodes: user.audits.nodes, 
            },
            progresses: user.progresses || []
          });
        } else {
          console.error('Unexpected response format:', data)
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [router])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="profile-container">
      <main className="profile-content">
        <h2 className="profile-title">Hello, {userData.firstName || userData.login.split(' ')[0]}!</h2>
        <div className="profile-card">
          <p className="profile-info"><strong>ID:</strong> {userData.id}</p>
          <p className="profile-info"><strong>Username:</strong> {userData.login}</p>
          <p className="profile-info"><strong>Email:</strong> {userData.email}</p>
        </div>  
        <div className="progress">
  {userData.audits ? (
    <DisplayAudits audits={userData.audits} />
  ) : (
    <div>Loading audits...</div>
  )}
</div>

<div className="Progress">
  {userData.progresses && Array.isArray(userData.progresses) ? (
    <DisplayProgress progresses={userData.progresses} />
  ) : (
    <div>Loading progress data...</div>
  )}
</div>


          
          <div className="chart-container">
            <div className="chart-item">
              <h2 className="chart-title">Skills Distribution</h2>
              <div className="chart-wrapper">
                <SkillsPieChart skills={userData.skills || []}/>
              </div>
            </div>
            <div className="chart-item">
              <h2 className="chart-title">Audit Ratio</h2>
              <div className="chart-wrapper">
                {userData.audit ? (
                  <AuditRatioChart user={userData.audit} />
                ) : (
                  <div>Loading audit data...</div>
                )}
              </div>
            </div>
          </div>
        
      </main>
    </div>
  )
}

