export const MiniLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="68" height="72" viewBox="0 0 68 72">
        <defs>
            <filter id="Tracé_18" x="0" y="0" width="66" height="66" filterUnits="userSpaceOnUse">
                <feOffset dy="6"/>
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feFlood floodOpacity="0.161"/>
                <feComposite operator="in" in2="blur"/>
                <feComposite in="SourceGraphic"/>
            </filter>
            <filter id="Tracé_17" x="10.5" y="8.5" width="56" height="56" filterUnits="userSpaceOnUse">
                <feOffset dx="-3" dy="-3"/>
                <feGaussianBlur stdDeviation="1.5" result="blur-2"/>
                <feFlood floodOpacity="0.161"/>
                <feComposite operator="in" in2="blur-2"/>
                <feComposite in="SourceGraphic"/>
            </filter>
            <filter id="Polygone_1" x="15" y="24" width="53" height="48" filterUnits="userSpaceOnUse">
                <feOffset dy="-4"/>
                <feGaussianBlur stdDeviation="3" result="blur-3"/>
                <feFlood floodOpacity="0.161"/>
                <feComposite operator="in" in2="blur-3"/>
                <feComposite in="SourceGraphic"/>
            </filter>
        </defs>
        <g id="MiniLogo" transform="translate(9 3)">
            <g transform="matrix(1, 0, 0, 1, -9, -3)" filter="url(#Tracé_18)">
            <path id="Tracé_18-2" data-name="Tracé 18" d="M24,0A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z" transform="translate(9 3)" fill="#2cb1b6"/>
            </g>
            <g transform="matrix(1, 0, 0, 1, -9, -3)" filter="url(#Tracé_17)">
            <path id="Tracé_17-2" data-name="Tracé 17" d="M23.5,0A23.5,23.5,0,1,1,0,23.5,23.5,23.5,0,0,1,23.5,0Z" transform="translate(18 16)" fill="#7f5af0"/>
            </g>
            <g transform="matrix(1, 0, 0, 1, -9, -3)" filter="url(#Polygone_1)">
            <path id="Polygone_1-2" data-name="Polygone 1" d="M17.5,0,35,30H0Z" transform="translate(24 37)" fill="#16161a"/>
            </g>
            <path id="Polygone_2" data-name="Polygone 2" d="M13,0,26,22H0Z" transform="translate(20 30)" fill="#16161a"/>
        </g>
    </svg>
);