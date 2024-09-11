"use client";

import CarteP from "./cartePlume.jpg"
import Image from "next/image";

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function Carte() {
  return (
    <Zoom>
      <Image src={CarteP} alt="carte Plume" />
    </Zoom>
  );
}
