'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    height: 170,
    weight: 70,
    avatar: null,
  })
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const mockUser = {
          username: '',
          email: '',
          avatar: '',
        }
        setUser(mockUser)
        setValue('username', mockUser.username)
        setValue('email', mockUser.email)
        setValue('height', mockUser.height)
        setValue('weight', mockUser.weight)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUser()
  }, [setValue])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер - 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('avatar', file)

    setIsLoading(true)
    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setUser(prev => ({ ...prev, avatar: response.data.url }))
    })
    .catch(error => {
      console.error('Ошибка загрузки аватара:', error)
      alert('Не удалось загрузить аватар')
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      console.log('Данные для обновления:', data)
      setUser(prev => ({ ...prev, ...data }))
      alert('Профиль успешно обновлен!')
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
      alert('Не удалось обновить профиль')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !preview) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen bg-gray-900 text-white">
      {/* Основной контент */}
      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Профиль пользователя</h1>

        <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Аватар */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 border-gray-700"
              onClick={handleAvatarClick}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Превью аватара"
                  fill
                  className="object-cover"
                />
              ) : user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Аватар пользователя"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Нет фото</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium">Изменить</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              {user.avatar ? 'Изменить аватар' : 'Добавить аватар'}
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Имя */}
              <div>
                <label htmlFor="username" className="block text-lg mb-2">
                  Имя
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username', { 
                    required: 'Имя обязательно',
                    minLength: {
                      value: 2,
                      message: 'Имя должно содержать минимум 2 символа'
                    }
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && (
                  <p className="mt-1 text-red-400">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Введите корректный email'
                    }
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Рост и вес */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="height" className="block text-lg mb-2">
                    Рост (см)
                  </label>
                  <input
                    id="height"
                    type="number"
                    {...register('height', { 
                      required: 'Рост обязателен',
                      valueAsNumber: true,
                      min: {
                        value: 100,
                        message: 'Рост должен быть от 100 см'
                      },
                      max: {
                        value: 250,
                        message: 'Рост должен быть до 250 см'
                      }
                    })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.height && (
                    <p className="mt-1 text-red-400">{errors.height.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-lg mb-2">
                    Вес (кг)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    {...register('weight', { 
                      required: 'Вес обязателен',
                      valueAsNumber: true,
                      min: {
                        value: 30,
                        message: 'Вес должен быть от 30 кг'
                      },
                      max: {
                        value: 300,
                        message: 'Вес должен быть до 300 кг'
                      }
                    })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-red-400">{errors.weight.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Навигационное меню */}
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="block p-2 hover:bg-gray-700 rounded">
              Календарь
            </Link>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Выйти
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}