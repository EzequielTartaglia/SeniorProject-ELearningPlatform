import Button from '@/components/Button'
import Image from 'next/image'
import React from 'react'

export default function UserCard({currentUser, currentUserRole, currentUserCountry}) {
  return (
    <div className="box-theme p-4">
    <div className="flex flex-col sm:flex-row sm:items-center">
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <Image
            src="/account.png"
            alt="User Avatar"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold">
          {currentUser.first_name} {currentUser.last_name}
        </h2>
        <p className="text-sm text-gray-600">
          {currentUserRole?.name}
        </p>
      </div>
      <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
        <Button
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
          route={"/platform/user/profile/settings"}
          isAnimated={false}
          title="Editar"
          text={"Editar"}
        />
        <Button
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
          route={"/platform/user/profile/change-password"}
          isAnimated={false}
          title="Cambiar Contraseña"
          text={"Cambiar Contraseña"}
        />
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-xl text-primary">
        Detalles de usuario
      </h3>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-title-active-static">Dirección de correo electrónico:</h3>
        <p className="text-primary">{currentUser.email}</p>
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-title-active-static">País:</h3>
        <p className="text-primary">{currentUserCountry?.name}</p>
      </div>
    </div>
  </div>
  )
}
