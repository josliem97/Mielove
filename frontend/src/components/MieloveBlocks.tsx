import React from 'react';
import { CalendarBlock, CountdownBlock, ButtonBlock, TimelineBlock, DresscodeBlock, AlbumBlock, WishesBlock, BankBlock, MapBlock } from "./canvas/blocks";

// Common Background and Overlays based on MiuWedding aesthetic
export const BlockWrapper = ({ children, bgColor = '#fbf9f6', style = {} }: { children: React.ReactNode, bgColor?: string, style?: any }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6" style={{ backgroundColor: bgColor, ...style }}>
        {children}
    </div>
);

// We define recursive rendering within the page.tsx file for true relative-recursive component processing.
// These blocks are primarily used as visual presets or complex leaf nodes.

export const HeroBlock = ({ props }: { props: any }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <img src={props.bgImage || "https://images.unsplash.com/photo-1546032996-6dfacbacba38?w=1200"} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="bg" />
        <div className="relative z-20 text-center flex flex-col items-center text-[#1D1D1F] px-6 w-full">
            <h1 className="font-script text-6xl tracking-widest drop-shadow-md">{props.groom || 'Chú rể'}</h1>
            <div className="text-3xl font-script z-10 -my-2">&amp;</div>
            <h1 className="font-script text-6xl tracking-widest drop-shadow-md">{props.bride || 'Cô dâu'}</h1>
        </div>
    </div>
);

// A reusable recursive renderer for the frontend presentation side
export const RecursiveRenderer = ({ components, replacePlaceholders }: { components: any[], replacePlaceholders: (text: string) => string }) => {
    return (
        <>
            {components.map((comp: any) => {
                return (
                    <div
                        key={comp.id}
                        style={{
                            position: "absolute",
                            left: comp.x, top: comp.y, width: comp.w, height: comp.h, zIndex: comp.z,
                            ...(comp.style || {})
                        }}
                    >
                        {comp.type === "container" && (
                            <div style={{ width: '100%', height: '100%', backgroundColor: comp.props.fill || 'transparent' }}>
                                {comp.components && <RecursiveRenderer components={comp.components} replacePlaceholders={replacePlaceholders} />}
                            </div>
                        )}
                        {comp.type === "element_text" && (
                            <div style={{
                                width: "100%", height: "100%",
                                color: comp.props.color || "#000",
                                fontSize: comp.props.fontSize || 16,
                                textAlign: comp.props.align || "left",
                                fontFamily: comp.props.fontFamily || "inherit",
                                fontWeight: comp.props.fontWeight || "normal",
                                lineHeight: comp.style?.lineHeight || 1.4,
                                whiteSpace: "pre-wrap",
                                display: 'flex', flexDirection: 'column',
                                justifyContent: comp.props.valign || 'center',
                            }}>
                                {replacePlaceholders(String(comp.props.text || ""))}
                            </div>
                        )}
                        {comp.type === "element_button" && <ButtonBlock props={comp.props} />}
                        {comp.type === "element_timeline" && <TimelineBlock props={comp.props} />}
                        {comp.type === "element_dresscode" && <DresscodeBlock props={comp.props} />}
                        {comp.type === "element_album" && <AlbumBlock props={comp.props} />}
                        {comp.type === "element_wishes" && <WishesBlock props={comp.props} slug="placeholder" />}
                        {comp.type === "element_bank" && <BankBlock props={comp.props} wedding={null} />}
                        {comp.type === "element_map" && <MapBlock props={comp.props} />}
                        {comp.type === "element_shape" && (
                            <div style={{
                                width: "100%", height: "100%",
                                backgroundColor: comp.props.fill || "transparent",
                                borderRadius: comp.props.borderRadius || 0,
                            }}></div>
                        )}
                        {comp.type === "element_image" && (
                            <div style={{
                                width: "100%", height: "100%",
                                backgroundImage: `url(${comp.props.src})`,
                                backgroundSize: comp.props.objectFit || "cover",
                                backgroundPosition: "center",
                                backgroundColor: "transparent",
                                borderRadius: comp.props.borderRadius || 0,
                            }}></div>
                        )}
                        {/* More element types can be handled here or inside page.tsx */}
                    </div>
                );
            })}
        </>
    );
};

