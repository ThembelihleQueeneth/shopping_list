import { useState } from 'react';
import { HomeNavbar } from '../components/HomeNavbar'
import { Card } from '../components/Card'

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HomeNavbar onSearchChange={setSearchTerm} />
      <Card searchTerm={searchTerm} />

    </>
  )
}
