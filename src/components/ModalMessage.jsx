import { useState } from 'react';
import { X, Send, Loader, AlertCircle, Mail, User, MessageCircle } from 'lucide-react';
import { apiSendMessage } from '../api/auth';

export default function ModalMessage({ token, destinataireEmail, destinataireLabel, onClose, onSent }) {
  const [contenu, setContenu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;
    setLoading(true); setError('');
    try {
      await apiSendMessage(token, destinataireEmail, contenu.trim());
      setContenu('');
      onSent?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erreur d'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',
      background:'rgba(12,28,63,.45)',backdropFilter:'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background:'#fff',borderRadius:'.75rem',width:'100%',maxWidth:480,boxShadow:'0 25px 50px -12px rgba(0,0,0,.25)',
        overflow:'hidden',animation:'modalIn .2s ease-out'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background:'#0c1c3f',color:'#fff',
          padding:'1.1rem 1.25rem',display:'flex',alignItems:'center',gap:'.75rem'
        }}>
          <div style={{width:36,height:36,borderRadius:'.5rem',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <MessageCircle size={18}/>
          </div>
          <div style={{flex:1}}>
            <h3 style={{margin:0,fontSize:'1rem',fontWeight:700}}>Envoyer un message</h3>
            <p style={{margin:0,fontSize:'.75rem',opacity:.9}}>Nouveau message</p>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',cursor:'pointer',opacity:.8}}><X size={20}/></button>
        </div>

        {/* Body */}
        <div style={{padding:'1.25rem'}}>
          {/* Destinataire */}
          <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem'}}>
            <span style={{fontSize:'.8rem',color:'#64748b'}}>À :</span>
            <span style={{
              display:'inline-flex',alignItems:'center',gap:'.35rem',
              background:'#f5f0e4',color:'#0c1c3f',border:'1px solid #efe3cb',
              borderRadius:'999px',padding:'.25rem .65rem',fontSize:'.8rem',fontWeight:500
            }}>
              <User size={12}/> {destinataireLabel || destinataireEmail}
            </span>
            {destinataireLabel && (
              <span style={{fontSize:'.75rem',color:'#94a3b8',display:'flex',alignItems:'center',gap:'.25rem'}}>
                <Mail size={11}/> {destinataireEmail}
              </span>
            )}
          </div>

          <form id="msg-modal-form" onSubmit={handleSubmit}>
            <div style={{position:'relative'}}>
              <textarea
                style={{
                  width:'100%',minHeight:120,padding:'.75rem 1rem',
                  border:'1px solid #d5dce8',borderRadius:'.5rem',
                  fontSize:'.9rem',color:'#1a2a4a',resize:'vertical',
                  outline:'none',transition:'border .15s,box-shadow .15s',
                  fontFamily:'inherit',lineHeight:1.5
                }}
                onFocus={e => { e.target.style.borderColor='#c5a150'; e.target.style.boxShadow='0 0 0 3px rgba(197,161,80,.12)'; }}
                onBlur={e => { e.target.style.borderColor='#d5dce8'; e.target.style.boxShadow='none'; }}
                placeholder="Écrivez votre message ici…"
                value={contenu}
                onChange={e => setContenu(e.target.value)}
                required
                disabled={loading}
              />
              <div style={{position:'absolute',bottom:'.5rem',right:'.75rem',fontSize:'.7rem',color:'#94a3b8',pointerEvents:'none'}}>
                {contenu.length} caractère{contenu.length > 1 ? 's' : ''}
              </div>
            </div>
          </form>

          {error && (
            <div style={{
              marginTop:'.75rem',display:'flex',alignItems:'center',gap:'.4rem',
              background:'#fee2e2',color:'#991b1b',padding:'.5rem .75rem',
              borderRadius:'.4rem',fontSize:'.8rem'
            }}>
              <AlertCircle size={14}/> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding:'.9rem 1.25rem',borderTop:'1px solid #f1f5f9',
          display:'flex',justifyContent:'flex-end',gap:'.5rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background:'#f8fafc',color:'#475569',border:'1px solid #e2e8f0',
              borderRadius:'.5rem',padding:'.45rem 1rem',fontSize:'.85rem',
              fontWeight:500,cursor:'pointer'
            }}
          >Annuler</button>
          <button
            form="msg-modal-form"
            disabled={loading || !contenu.trim()}
            style={{
              background: loading || !contenu.trim() ? '#b3c0d5' : '#c5a150',
              color:'#fff',border:'none',borderRadius:'.5rem',
              padding:'.45rem 1rem',fontSize:'.85rem',fontWeight:500,
              cursor: loading || !contenu.trim() ? 'not-allowed' : 'pointer',
              display:'inline-flex',alignItems:'center',gap:'.35rem'
            }}
          >
            {loading ? <Loader size={14} className="auth-spinner"/> : <Send size={14}/>}
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
