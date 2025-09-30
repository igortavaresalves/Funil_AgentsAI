import React from 'react'

const images = [
  'https://picsum.photos/seed/1/400/300',
  'https://picsum.photos/seed/2/400/300',
  'https://picsum.photos/seed/3/400/300',
  'https://picsum.photos/seed/4/400/300',
]

export default function ImageGallery(){
  return (
    <div className="card image-grid">
      {images.map((src,i)=> (
        // eslint-disable-next-line
        <img key={i} src={src} alt={`foto-${i}`} />
      ))}
    </div>
  )
}
