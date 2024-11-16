"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import confetti from "canvas-confetti";
import * as THREE from "three";
import styles from "./BirthdayUltimateCard.module.css";

const BirthdayUltimateCard = () => {
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const sceneRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [bgColor, setBgColor] = useState(0);
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const colors = [
    "linear-gradient(135deg, #2c2c2c, #ff3333)",
    "linear-gradient(135deg, #1a1a1a, #a83279)",
    "linear-gradient(135deg, #333333, #ff0000)",
    "linear-gradient(135deg, #202020, #ff6347)",
  ];

  const messages = [
    "🎉 Happy Birthday!",
    "🥋 To the Taekwondo Champion!",
    "📚 Math Genius, Keep Shining!",
    "🔥 You're Amazing, Keep Being Awesome!",
    "🎂 Here's to a Wonderful Year Ahead!",
  ];

  useEffect(() => {
    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Sphere Geometry (Particle Effect)
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.PointsMaterial({ color: 0xff3333, size: 0.1 });
    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;

    // GSAP Animation: Card Entrance
    gsap.fromTo(
      card,
      { opacity: 0, rotateY: 90 },
      { opacity: 1, rotateY: 0, duration: 1.5, ease: "power3.out" }
    );

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      startCelebration();
    }
  }, [countdown]);

  const handleClick = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1);
    } else {
      startCelebration();
    }

    gsap.to(buttonRef.current, {
      scale: 1.1,
      backgroundColor: "#ff3333",
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  };

  const changeBackground = () => {
    setBgColor((prev) => (prev + 1) % colors.length);
    gsap.to("body", { background: colors[bgColor], duration: 1 });
  };

  const startCelebration = () => {
    if (celebrationStarted) return;
    setCelebrationStarted(true);

    // Fire Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff3333", "#ffffff", "#a83279"],
    });

    // Play Celebration Music
    const audio = new Audio("/birthday.mp3");
    audio.play();

    // Animate the card
    gsap.to(cardRef.current, {
      scale: 1.1,
      rotate: 360,
      duration: 2,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div className={styles.container}>
      <img src="/He.png" alt="Profile" className={`${styles.profileImage} shadow-yellow-600 absolute top-10`} />
      <div ref={sceneRef} className={styles.scene}></div>
      <div ref={cardRef} className={styles.card}>
        <h1 className={styles.title}>{messages[messageIndex]}</h1>
        {countdown > 0 ? (
          <p className={styles.countdown}>🎊 Celebration in: {countdown}s</p>
        ) : (
          <p className={styles.countdown}>🎉 Fuck You!</p>
        )}
        <button
          ref={buttonRef}
          className={styles.button}
          onClick={handleClick}
        >
          {messageIndex < messages.length - 1
            ? "Next Surprise! 🎁"
            : "Celebrate 🎉"}
        </button>
        <button className={styles.changeBg} onClick={changeBackground}>
          Change Background 🌈
        </button>

      </div>
    </div>
  );
};

export default BirthdayUltimateCard;
