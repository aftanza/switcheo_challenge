/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
                port: "",
                pathname: "/Switcheo/token-icons/refs/heads/main/tokens/**",
                // search: "",
            },
        ],
    },
};

export default nextConfig;
