import { useEffect, useState } from "react"
import { loadTexture } from "./textures"

export default function useImage(fileName : string): {loading: boolean, image: string | undefined, error: unknown;
} {
const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)
    const [image, setImage] = useState<string>()

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await import(loadTexture(fileName))
                setImage(response.default)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchImage()
    }, [fileName])

    return {
        loading,
        error,
        image,
    }
}
