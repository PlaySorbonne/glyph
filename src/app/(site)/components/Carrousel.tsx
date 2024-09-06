"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import styles from "./Carrousel.module.css";
import fraternities from "@/assets/fraternities";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carrousel() {
  let slides = [
    {
      title: "Saka",
      subtitle: "Rapidité et improvisation sont nos armes",
      cover: fraternities.saka.fond,
      logo: fraternities.saka.logo,
      joinMsg: "Dépêchez-vous de rejoindre Saka !",
    },
    {
      title: "Pietr",
      subtitle: "Notre motivation est inébranlable",
      cover: fraternities.pietr.fond,
      logo: fraternities.pietr.logo,
      joinMsg: "Jouez pour Pietr !",
    },
    {
      title: "Foli",
      subtitle: "La connaissance et la coopération nous guident",
      cover: fraternities.foli.fond,
      logo: fraternities.foli.logo,
      joinMsg: "Choisissez de jouer pour Foli !",
    },
  ];
  return (
    <Swiper
      loop={true}
      navigation={true}
      pagination={true}
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      className={styles.carrousel}
      effect="fade"
    >
      {slides.map((slide, index) => (
        <SwiperSlide
          key={index}
          className={styles.slide}
          style={{ backgroundImage: `url(${slide.cover.src})` }}
        >
          <div className={styles.content}>
            <div className={styles.textWrapper}>
              <h1 className={styles.title}>{slide.title}</h1>
              <Image
                src={slide.logo}
                alt={slide.title}
                className={styles.logo}
                width={200}
                height={200}
                loading="eager"
              />
              <h2 className={styles.subtitle}>{slide.subtitle}</h2>
              <Link href="/welcome" className={styles.join}>
                {slide.joinMsg}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
