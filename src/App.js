import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const PARTNER_NAME = "ULLA BOASIAKO";
const VALENTINES_DAY = new Date('2026-02-14T00:00:00');

// All the beautiful photos
const PHOTOS = {
  kissing: '/assets/picture_of_us_kissing.jpeg',
  usTogether: '/assets/picture_of_us_1.jpeg',
  herSmiling: '/assets/picture_of_her_smiling.jpg',
  her1: '/assets/picture_of_her_1.JPG',
  her2: '/assets/picture_of_her_2.JPG',
  bears: '/assets/bears.gif'
};

// Teasing messages when hovering NO button
const TEASING_MESSAGES = [
  "Are you sure about that? 🤔",
  "Think again, my love! 💭",
  "Wrong button! Try the green one 💚",
  "You don't mean that! 😢",
  "My heart can't take this! 💔",
  "Give love a chance! 💕",
  "But we're perfect together! 🥺",
  "I promise to love you forever! 💖"
];

// Love message for celebration
const LOVE_MESSAGE = `I'll touch that fire for you,
I'll do that three, four times again.

I will testify for you.
I will tell that lie,
I'll kill that person.

I will do what all of them around you are scared to do
because I draw strength and courage from your love.

I will cross all boundaries of success
and rule the world
just so I can call you my queen...

I love you, Ulla Boasiako Nanaya 💕`;

function App() {
  // State management
  const [stage, setStage] = useState('intro'); // 'countdown', 'intro', 'question', 'celebration'
  const [typedText, setTypedText] = useState('');
  const [noClickCount, setNoClickCount] = useState(0);
  const [yesSize, setYesSize] = useState(18);
  const [showNoChoice, setShowNoChoice] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [petals, setPetals] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showKissingPhoto, setShowKissingPhoto] = useState(false);
  const [teasingMessage, setTeasingMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [cursorTrail, setCursorTrail] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isValentinesDay, setIsValentinesDay] = useState(false);
  const [memories, setMemories] = useState([]);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  // Runaway button position
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isRunningAway, setIsRunningAway] = useState(false);

  const audioRef = useRef(null);
  const fullQuestion = "Will you be my Valentine?";

  // Check if it's Valentine's Day and calculate countdown (only once on mount)
  useEffect(() => {
    const now = new Date();
    const diff = VALENTINES_DAY - now;

    if (diff <= 0) {
      setIsValentinesDay(true);
    }
  }, []);

  // Update countdown timer every second (only when not Valentine's Day)
  useEffect(() => {
    if (isValentinesDay) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = VALENTINES_DAY - now;

      if (diff <= 0) {
        setIsValentinesDay(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isValentinesDay]);

  // Load memories from the memories folder
  useEffect(() => {
    // All memories - images and videos with romantic captions
    const allMemories = [
      // Images from memories folder
      { type: 'image', src: '/assets/memories/2E3E0857-BD5E-4958-860D-4BFD57995708.jpg', caption: 'Every moment with you is magic 💫' },
      { type: 'image', src: '/assets/memories/IMG_7521.jpg', caption: 'My heart belongs to you 💕' },
      { type: 'image', src: '/assets/memories/IMG_7538.jpg', caption: 'You are my sunshine ☀️' },
      { type: 'image', src: '/assets/memories/IMG_7579.jpg', caption: 'Forever grateful for you 🙏' },
      { type: 'image', src: '/assets/memories/IMG_7606.jpg', caption: 'My beautiful queen 👑' },
      { type: 'image', src: '/assets/memories/IMG_7616.JPG', caption: 'You make my heart skip a beat 💓' },
      { type: 'image', src: '/assets/memories/IMG_7635.jpg', caption: 'Lost in your eyes 👀💖' },
      { type: 'image', src: '/assets/memories/IMG_7644.jpg', caption: 'My favorite view 😍' },
      { type: 'image', src: '/assets/memories/IMG_7645.jpg', caption: 'Falling deeper in love each day 💘' },
      { type: 'image', src: '/assets/memories/IMG_7909.jpg', caption: 'You complete me 💑' },
      { type: 'image', src: '/assets/memories/IMG_7913.jpg', caption: 'My ride or die 🚗💨' },
      { type: 'image', src: '/assets/memories/IMG_7916.jpg', caption: 'The one I prayed for 🤲' },
      { type: 'image', src: '/assets/memories/IMG_7917.jpg', caption: 'My everything 💯' },
      { type: 'image', src: '/assets/memories/IMG_8340.jpg', caption: 'Love looks good on us 💅' },
      { type: 'image', src: '/assets/memories/IMG_8544.jpg', caption: 'Us against the world 🌍' },
      { type: 'image', src: '/assets/memories/IMG_8909.JPG', caption: 'My favorite person 🥰' },
      // Videos from memories folder
      { type: 'video', src: '/assets/memories/118E579A-D803-45D7-815D-F4840AF133B3.MP4', caption: 'Our beautiful moments 🎥💕' },
      { type: 'video', src: '/assets/memories/IMG_7477.mp4', caption: 'Remember this day? 📅💖' },
      { type: 'video', src: '/assets/memories/IMG_7503.mp4', caption: 'Making memories with you 🎬' },
      { type: 'video', src: '/assets/memories/IMG_7515.mp4', caption: 'Every second with you counts ⏰' },
      { type: 'video', src: '/assets/memories/IMG_7578.mp4', caption: 'Our love story continues 📖' },
      { type: 'video', src: '/assets/memories/IMG_7756.mp4', caption: 'Captured forever 📸' },
      { type: 'video', src: '/assets/memories/IMG_7788.mp4', caption: 'This is us 💑' },
      { type: 'video', src: '/assets/memories/IMG_7950.mp4', caption: 'Living our best life together 🌟' },
      { type: 'video', src: '/assets/memories/IMG_8579.mp4', caption: 'Adventures with my love 🗺️' },
      { type: 'video', src: '/assets/memories/IMG_8580.mp4', caption: 'You and me, always 💞' },
      { type: 'video', src: '/assets/memories/ScreenRecording_02-01-2026 19-47-30_1.mp4', caption: 'A special moment 💝' },
      { type: 'video', src: '/assets/memories/ScreenRecording_12-30-2025 20-52-55_1.mp4', caption: 'Memories that last forever 💫' },
      // Original photos
      { type: 'image', src: PHOTOS.usTogether, caption: 'Together is my favorite place 🏠' },
      { type: 'image', src: PHOTOS.herSmiling, caption: 'That smile that lights up my life ✨' },
      { type: 'image', src: PHOTOS.her1, caption: 'So beautiful, inside and out 💖' },
      { type: 'image', src: PHOTOS.her2, caption: 'My queen, Ulla 👑' },
      { type: 'image', src: PHOTOS.kissing, caption: 'The moment I knew you were the one 💋' },
    ];
    setMemories(allMemories);
  }, []);

  // Auto-advance memories slideshow - 5 seconds for images, videos advance on end
  useEffect(() => {
    if (memories.length === 0 || isValentinesDay) return;

    const currentMemory = memories[currentMemoryIndex];

    // Only auto-advance for images (videos advance via onEnded event)
    if (currentMemory && currentMemory.type === 'image') {
      const timeout = setTimeout(() => {
        setCurrentMemoryIndex(prev => (prev + 1) % memories.length);
      }, 5000); // 5 seconds for images

      return () => clearTimeout(timeout);
    }
  }, [memories, currentMemoryIndex, isValentinesDay]);

  // Sparkle cursor trail
  useEffect(() => {
    const handleMouseMove = (e) => {
      const newSparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setCursorTrail(prev => [...prev.slice(-20), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clean up cursor trail
  useEffect(() => {
    const cleanup = setInterval(() => {
      setCursorTrail(prev => prev.slice(1));
    }, 50);
    return () => clearInterval(cleanup);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (stage === 'question' && typedText.length < fullQuestion.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullQuestion.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [stage, typedText]);

  // Create falling hearts
  const createHearts = useCallback(() => {
    const newHearts = [];
    for (let i = 0; i < 50; i++) {
      newHearts.push({
        id: `heart-${Date.now()}-${i}`,
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        size: Math.random() * 20 + 10
      });
    }
    setHearts(newHearts);
  }, []);

  // Create falling rose petals
  const createPetals = useCallback(() => {
    const newPetals = [];
    for (let i = 0; i < 30; i++) {
      newPetals.push({
        id: `petal-${Date.now()}-${i}`,
        left: Math.random() * 100,
        animationDuration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        size: Math.random() * 15 + 10,
        rotation: Math.random() * 360
      });
    }
    setPetals(newPetals);
  }, []);

  // Create confetti explosion
  const createConfetti = useCallback(() => {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#c9b1ff'];
    const newConfetti = [];
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: `confetti-${Date.now()}-${i}`,
        left: 50 + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5,
        size: Math.random() * 10 + 5,
        angle: Math.random() * 360
      });
    }
    setConfetti(newConfetti);
    // Clear confetti after animation
    setTimeout(() => setConfetti([]), 3000);
  }, []);

  // Continuous effects in celebration
  useEffect(() => {
    if (stage === 'celebration') {
      createHearts();
      createPetals();
      const heartsInterval = setInterval(createHearts, 4000);
      const petalsInterval = setInterval(createPetals, 5000);
      return () => {
        clearInterval(heartsInterval);
        clearInterval(petalsInterval);
      };
    }
  }, [stage, createHearts, createPetals]);

  // Rose petals on intro and question stages
  useEffect(() => {
    if (stage === 'intro' || stage === 'question') {
      createPetals();
      const interval = setInterval(createPetals, 6000);
      return () => clearInterval(interval);
    }
  }, [stage, createPetals]);

  // Romantic reveal of kissing photo
  useEffect(() => {
    if (stage === 'celebration') {
      const timer = setTimeout(() => {
        setShowKissingPhoto(true);
      }, 800);
      const loveMessageTimer = setTimeout(() => {
        setShowLoveMessage(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(loveMessageTimer);
      };
    }
  }, [stage]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Play music on click or scroll
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = 1.13;

    const playMusic = () => {
      audio.play().catch(() => {});
      document.removeEventListener('click', playMusic);
      document.removeEventListener('scroll', playMusic);
      document.removeEventListener('touchstart', playMusic);
    };

    document.addEventListener('click', playMusic);
    document.addEventListener('scroll', playMusic);
    document.addEventListener('touchstart', playMusic);

    return () => {
      document.removeEventListener('click', playMusic);
      document.removeEventListener('scroll', playMusic);
      document.removeEventListener('touchstart', playMusic);
    };
  }, []);

  const handleRevealClick = () => {
    setStage('question');
  };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setMusicStarted(true);
    }
  };

  const handleYesClick = async () => {
    setStage('celebration');
    createHearts();
    createPetals();
    createConfetti();

    // Send secret email notification
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${PARTNER_NAME} said YES! She will be your Valentine!`,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('Notification sent silently');
    }
  };

  // Runaway button with teasing messages and screen shake
  const handleNoMouseOver = () => {
    setIsRunningAway(true);

    // Random position
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 300;
    setNoButtonPos({ x, y });

    // Show teasing message
    const randomMessage = TEASING_MESSAGES[Math.floor(Math.random() * TEASING_MESSAGES.length)];
    setTeasingMessage(randomMessage);

    // Shake the screen
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Increment count and grow YES button
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);
    setYesSize(prev => prev + 4);

    // After many attempts, hide the button
    if (newCount >= 8) {
      setShowNoChoice(true);
    }
  };

  const handleNoClick = () => {
    setShowNoChoice(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const skipToValentine = () => {
    setIsValentinesDay(true);
    setStage('intro');
  };

  return (
    <div className={`app ${stage === 'celebration' ? 'celebration-bg' : ''} ${isShaking ? 'shake' : ''}`}>
      {/* Custom Sparkle Cursor Trail */}
      <div className="cursor-trail">
        {cursorTrail.map((sparkle, index) => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              opacity: (index + 1) / cursorTrail.length,
              transform: `scale(${(index + 1) / cursorTrail.length})`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Background Music */}
      <audio ref={audioRef} loop playsInline>
        <source src="/assets/intro.mp3" type="audio/mpeg" />
      </audio>

      {/* Pulsing Heart Background */}
      <div className="heart-background">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="heart-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB3B3" />
              <stop offset="50%" stopColor="#FF9999" />
              <stop offset="100%" stopColor="#FF6666" />
            </radialGradient>
          </defs>
          <path
            d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
            fill="url(#heart-gradient)"
          />
        </svg>
      </div>

      {/* Falling Hearts */}
      <div className="hearts-container">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="falling-heart"
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.animationDuration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Falling Rose Petals */}
      <div className="petals-container">
        {petals.map(petal => (
          <div
            key={petal.id}
            className="falling-petal"
            style={{
              left: `${petal.left}%`,
              animationDuration: `${petal.animationDuration}s`,
              animationDelay: `${petal.delay}s`,
              fontSize: `${petal.size}px`,
              '--rotation': `${petal.rotation}deg`
            }}
          >
            🌹
          </div>
        ))}
      </div>

      {/* Confetti Explosion */}
      <div className="confetti-container">
        {confetti.map(piece => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDuration: `${piece.animationDuration}s`,
              animationDelay: `${piece.delay}s`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              '--angle': `${piece.angle}deg`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Audio Controls */}
        <div className="audio-controls">
          {!musicStarted && (
            <button onClick={startMusic} className="play-music-btn">
              🎵 Play Me
            </button>
          )}
          {musicStarted && (
            <>
              <button onClick={toggleMute} className="mute-btn">
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </>
          )}
        </div>

        {/* Countdown Stage - Before Valentine's Day */}
        {!isValentinesDay && (
          <div className="countdown-section">
            <div className="glass-card countdown-card">
                            <p className="countdown-subtitle">For you, Ulla Boasiako Nanaya</p>

              <div className="countdown-timer">
                <div className="countdown-item">
                  <span className="countdown-number">{countdown.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number">{countdown.hours}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number">{countdown.minutes}</span>
                  <span className="countdown-label">Minutes</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number">{countdown.seconds}</span>
                  <span className="countdown-label">Seconds</span>
                </div>
              </div>

              
              {/* Memory Lane Slideshow */}
              {memories.length > 0 && (
                <div className="memory-lane">
                  <h2 className="memory-title">💕 Memory Lane 💕</h2>
                  <div className="memory-card" key={currentMemoryIndex}>
                    {memories[currentMemoryIndex].type === 'image' && (
                      <img src={memories[currentMemoryIndex].src} alt="Our memory" className="memory-image" />
                    )}
                    {memories[currentMemoryIndex].type === 'video' && (
                      <video
                        src={memories[currentMemoryIndex].src}
                        autoPlay
                        playsInline
                        className="memory-video"
                        onEnded={() => setCurrentMemoryIndex(prev => (prev + 1) % memories.length)}
                      />
                    )}
                    <p className="memory-caption">{memories[currentMemoryIndex].caption}</p>
                  </div>
                </div>
              )}

              {/* Skip button for testing */}
              <button onClick={skipToValentine} className="skip-btn">
                CLICK ME!!!
              </button>
            </div>
          </div>
        )}

        {/* Intro Stage */}
        {isValentinesDay && stage === 'intro' && (
          <div className="intro-section">
            <div className="floating-photo intro-photo">
              <img src={PHOTOS.herSmiling} alt="My love" />
            </div>

            <div className="glass-card">
              <h1 className="intro-title">I Have a Question to Ask!!!</h1>
              <button onClick={handleRevealClick} className="reveal-btn">
                Click to find out 💕
              </button>
            </div>
          </div>
        )}

        {/* Question Stage */}
        {isValentinesDay && stage === 'question' && (
          <div className="question-section">
            <div className="floating-photo question-photo-left">
              <img src={PHOTOS.her1} alt="Beautiful" />
            </div>
            <div className="floating-photo question-photo-right">
              <img src={PHOTOS.her2} alt="Gorgeous" />
            </div>

            <div className="glass-card">
              <h1 className="partner-name">{PARTNER_NAME}</h1>
              <p className="typed-question">
                {typedText}
                <span className="cursor">|</span>
              </p>

              {/* Teasing message */}
              {teasingMessage && !showNoChoice && (
                <p className="teasing-message">{teasingMessage}</p>
              )}

              <div className="choice-buttons">
                <button
                  onClick={handleYesClick}
                  className="yes-btn"
                  style={{ fontSize: `${yesSize}px`, padding: `${yesSize/2}px ${yesSize}px` }}
                >
                  Yes 💕
                </button>

                {!showNoChoice && (
                  <button
                    onMouseOver={handleNoMouseOver}
                    onTouchStart={handleNoMouseOver}
                    onClick={handleNoClick}
                    className={`no-btn runaway-btn ${isRunningAway ? 'running' : ''}`}
                    style={{
                      transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                    }}
                  >
                    I hate you, leave me alone
                  </button>
                )}
              </div>

              {showNoChoice && (
                <p className="no-choice-text">Did you really think you had a choice? 😏💕</p>
              )}
            </div>
          </div>
        )}

        {/* Celebration Stage */}
        {isValentinesDay && stage === 'celebration' && (
          <div className="celebration-section">
            <div className="celebration-content">
              <h1 className="love-declaration">I LOVE YOU,</h1>
              <h1 className="partner-name-big">{PARTNER_NAME}</h1>

              {/* Main kissing photo - romantic pop-up */}
              <div className={`kissing-photo-container ${showKissingPhoto ? 'show' : ''}`}>
                <div className="kissing-photo-frame">
                  <img src={PHOTOS.kissing} alt="Us kissing" />
                </div>
                <p className="photo-caption">Forever & Always 💕</p>
              </div>

              {/* Love Message */}
              {showLoveMessage && (
                <div className="love-message-container">
                  <div className="love-message">
                    <h2>💌 A Letter For You 💌</h2>
                    <p>{LOVE_MESSAGE}</p>
                  </div>
                </div>
              )}

              {/* Photo gallery */}
              <div className="photo-gallery">
                <div className="gallery-photo">
                  <img src={PHOTOS.usTogether} alt="Us together" />
                </div>
                <div className="gallery-photo">
                  <img src={PHOTOS.herSmiling} alt="Your beautiful smile" />
                </div>
                <div className="gallery-photo">
                  <img src={PHOTOS.her1} alt="My love" />
                </div>
              </div>

              {/* Cute bears */}
              <div className="bears-gif">
                <img src={PHOTOS.bears} alt="Cute bears" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
