'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Importation correcte des modules
import 'swiper/css'; // Styles de base
import 'swiper/css/autoplay'; // Styles pour l'autoplay
import 'swiper/css/navigation'; // Styles pour les boutons de navigation
import 'swiper/css/pagination'; // Styles pour la pagination

export default function BannerSwiper() {
    return (
        <div className="relative mb-8">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                className="relative rounded-lg"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <div className="relative">
                        <img
                            src="/banner1.png"
                            alt="Bannière 1"
                            className="w-full h-[500px] object-cover rounded-lg"
                        />
                      
                    </div>
                </SwiperSlide>
                {/* Slide 2 */}
                <SwiperSlide>
                    <img
                        src="/banner2.png"
                        alt="Bannière 2"
                        className="w-full h-[500px] object-cover rounded-lg"
                    />
                </SwiperSlide>
                {/* Slide 3 */}
                <SwiperSlide>
                    <img
                        src="/banner3.png"
                        alt="Bannière 3"
                        className="w-full h-[500px] object-cover rounded-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/banner5.png"
                        alt="Bannière 3"
                        className="w-full h-[500px] object-cover rounded-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/banner6.png"
                        alt="Bannière 3"
                        className="w-full h-[500px] object-cover rounded-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/banner7.png"
                        alt="Bannière 3"
                        className="w-full h-[500px] object-cover rounded-lg"
                    />
                </SwiperSlide>
               
            </Swiper>


        </div>
    );
}
