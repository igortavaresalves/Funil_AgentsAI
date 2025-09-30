import React from 'react'
import ChatSection from './ChatSection'

type Props = { onClose: () => void }

export default function ChatModal({ onClose }: Props){
  return (
    <div className="modal-backdrop fade-in" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{marginTop:0}}>Converse com a Rosa</h3>
        <ChatSection />
      </div>
    </div>
  )
}
