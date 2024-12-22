class AudioService {
  constructor() {
    this.audio = new Audio('/sounds/notificacao.mp3');
    this.audio.volume = 0.5; // Volume 50%
  }

  playNotificationSound() {
    try {
      if (!this.audio) {
        console.warn('Arquivo de áudio não encontrado');
        return;
      }
      // Reinicia o áudio se já estiver tocando
      this.audio.currentTime = 0;
      this.audio.play().catch(error => {
        console.warn('Não foi possível tocar o som:', error);
      });
    } catch (error) {
      console.error('Erro ao tocar som de notificação:', error);
    }
  }
}

export const audioService = new AudioService(); 