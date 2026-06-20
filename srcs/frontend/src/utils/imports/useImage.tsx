import { useEffect, useState } from "react"

export default function useImage(fileName : string) {
const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)
    const [image, setImage] = useState<HTMLImageElement>()

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await import(`../../assets/img/${fileName}.png`) // change relative path to suit your needs
                setImage(response.default)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchImage()
    }, [fileName])

	console.log(image);
	console.log(fileName);
	
	
    return {
        loading,
        error,
        image,
    }
}
