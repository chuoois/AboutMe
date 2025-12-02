export const paginationBtnStyle = (disabled: boolean) => ({
  background: 'var(--surface)',
  border: '2px solid var(--text-muted)',
  color: disabled ? 'var(--overlay)' : 'var(--text-main)',
  padding: '5px 15px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '18px',
  fontFamily: "'VT323', monospace",
  boxShadow: disabled ? 'none' : '4px 4px 0px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.2s',
  opacity: disabled ? 0.5 : 1,
  transform: disabled ? 'none' : 'translateY(0)',
});
