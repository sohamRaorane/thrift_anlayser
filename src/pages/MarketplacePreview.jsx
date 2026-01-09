import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import './MarketplacePreview.css';
import { supabase } from '../lib/supabase';

const MarketplacePreview = () => {
    // Resolve image URLs from Supabase Storage so we don't bundle
    // large preview assets in the frontend repo.
    const bucket = supabase.storage.from('store-assets');
    const greenvaleUrl = bucket.getPublicUrl('Greenvale2.jpeg').data.publicUrl;
    const secondImageUrl = bucket.getPublicUrl('image.png').data.publicUrl;

    // Use Greenvale for first slide and the new image.png
    // for the remaining slides.
    const images = [
        {
            src: greenvaleUrl,
            label: "This is how buyers see your store interior"
        },
        {
            src: secondImageUrl,
            label: "This is how buyers see your store exterior"
        },
        {
            src: secondImageUrl,
            label: "This is how buyers see your promotional hoarding"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="preview-shell">
            <div className="preview-content">
                <div className="preview-frame">
                    <img
                        src={images[currentIndex].src}
                        alt="Store Preview"
                        className="preview-image"
                    />

                    <p className="preview-caption">{images[currentIndex].label}</p>

                    <button className="carousel-nav-btn" onClick={nextImage}>
                        <ArrowRight size={24} />
                    </button>

                    <div className="carousel-indicators">
                        {images.map((_, idx) => (
                            <span
                                key={idx}
                                className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplacePreview;
