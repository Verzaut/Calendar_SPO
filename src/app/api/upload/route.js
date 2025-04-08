import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request) {
  try {
    const data = await request.formData()
    const file = data.get('avatar')

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не загружен' },
        { status: 400 }
      )
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Пожалуйста, загрузите файл изображения' },
        { status: 400 }
      )
    }

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер - 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Уникальное имя файла
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const filename = `avatar_${timestamp}${ext}`

    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)
    
    // URL для доступа к файлу
    const fileUrl = `/uploads/${filename}`
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
    return NextResponse.json(
      { error: 'Произошла ошибка при загрузке файла' },
      { status: 500 }
    )
  }
}