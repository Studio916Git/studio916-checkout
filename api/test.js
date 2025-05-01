import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function StickerOrderForm() {
    const [shape, setShape] = useState("")
    const [type, setType] = useState("")
    const [size, setSize] = useState("")
    const [customWidth, setCustomWidth] = useState("")
    const [customHeight, setCustomHeight] = useState("")
    const [quantity, setQuantity] = useState("")
    const [customQuantity, setCustomQuantity] = useState("")
    const [packaging, setPackaging] = useState(false)
    const [designs, setDesigns] = useState(1)
    const [designFiles, setDesignFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [missingDesignError, setMissingDesignError] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState(false)

    // Helper to save form state to localStorage
    const saveToLocalStorage = (data) => {
        localStorage.setItem(
            "stickerOrderForm",
            JSON.stringify({
                shape,
                type,
                size,
                customWidth,
                customHeight,
                quantity,
                customQuantity,
                packaging,
                designs,
                designFiles,
                ...data,
            })
        )
    }

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("stickerOrderForm"))
        if (savedState) {
            setShape(savedState.shape || "")
            setType(savedState.type || "")
            setSize(savedState.size || "")
            setCustomWidth(savedState.customWidth || "")
            setCustomHeight(savedState.customHeight || "")
            setQuantity(savedState.quantity || "")
            setCustomQuantity(savedState.customQuantity || "")
            setPackaging(savedState.packaging || false)
            setDesigns(savedState.designs || 1)
            setDesignFiles(savedState.designFiles || [])
        }
    }, [])
    const handleDesignFileChange = (index, file) => {
        const updatedFiles = [...designFiles]
        updatedFiles[index] = file
        setDesignFiles(updatedFiles)
        saveToLocalStorage({ designFiles: updatedFiles })
    }

    const renderDesignUploads = () => {
        const inputs = []
        for (let i = 0; i < designs; i++) {
            inputs.push(
                <div key={i}>
                    <label style={labelStyle}>Design {i + 1}</label>
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.ai,.pdf"
                        style={inputStyle}
                        onChange={(e) =>
                            handleDesignFileChange(i, e.target.files[0])
                        }
                    />
                </div>
            )
        }
        return inputs
    }
    const labelStyle = {
        fontFamily: "'Switzer', sans-serif",
        fontSize: "16px",
        fontWeight: 500,
        marginBottom: 6,
        display: "block",
        color: "#ffffff",
    }

    const inputStyle = {
        fontFamily: "'Switzer', sans-serif",
        fontSize: "16px",
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        width: "100%",
        minHeight: "50px",
        outline: "none",
        transition: "all 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        color: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    }

    const selectInputStyle = {
        ...inputStyle,
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        paddingRight: "36px",
        backgroundImage:
            "url('data:image/svg+xml;utf8,<svg fill=\\'%23fff\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' width=\\'24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M7 10l5 5 5-5z\\'/></svg>')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "16px 16px",
    }

    const halfInputStyle = {
        ...inputStyle,
        width: "100%",
    }

    const quantityOptions = [250, 500, 1000, 2000, 3000, 5000, 7500, 10000]

    const quantityGridStyle = {
        display: "grid",
        gap: "8px",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        marginTop: "6px",
        marginBottom: "6px",
    }

    const quantityButtonStyle = {
        fontFamily: "'Switzer', sans-serif",
        fontSize: "14px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        backgroundColor: "rgba(255,255,255,0.03)",
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.2s ease",
    }

    // Removed handleFocus and handleBlur for a cleaner modern look

    const containerStyle = {
        maxWidth: 600,
        width: "100%",
        margin: "40px auto",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        background: "rgba(30, 30, 30, 0.65)",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
    }

    const getSizeCost = () => {
        let width, height

        if (size === "custom" && customWidth && customHeight) {
            width = parseFloat(customWidth)
            height = parseFloat(customHeight)
        } else if (size && size.includes("x")) {
            ;[width, height] = size.split("x").map(Number)
        }

        if (!width || !height || isNaN(width) || isNaN(height)) return 0
        if (width < 1 || height < 1 || width > 10 || height > 10) return 0

        const area = width * height
        const baseCostPer250 = 40 + area * 2.25
        return Math.round(baseCostPer250)
    }

    const getMarkup = () => 1.65

    const getQuantityCount = () => {
        if (quantity === "custom") return parseInt(customQuantity || "0")
        return parseInt(quantity || "0")
    }

    const isPackagingAllowed = () => {
        if (size === "custom") {
            const width = parseFloat(customWidth)
            const height = parseFloat(customHeight)
            return (
                !isNaN(width) &&
                !isNaN(height) &&
                width <= 2.91 &&
                height <= 4.13
            )
        } else if (size) {
            const [w, h] = size.split("x").map(Number)
            return w <= 2.91 && h <= 4.13
        }
        return false
    }

    const calculateQuote = () => {
        const baseCost = getSizeCost()
        const count = getQuantityCount()
        if (!count || isNaN(count)) return "-"
        const costPer250 = baseCost || 100
        const units = Math.pow(count / 250, 0.75)
        const stickerCost = costPer250 * units
        const packagingCost =
            packaging && isPackagingAllowed() ? count * 0.2 : 0
        const rawTotal = stickerCost + packagingCost
        let typeMultiplier = 1
        if (type === "holographic") typeMultiplier = 1.15
        if (type === "spot-uv") typeMultiplier = 1.25
        const adjustedTotal = rawTotal * typeMultiplier
        const marginMultiplier = 1.65
        const quote = adjustedTotal * marginMultiplier

        return `$${quote.toFixed(2)}`
    }

    const isFormComplete = () => {
        const hasBasic = shape && type && size && quantity
        const hasCustomSize =
            size !== "custom" ||
            (customWidth &&
                customHeight &&
                parseFloat(customWidth) >= 1 &&
                parseFloat(customHeight) >= 1 &&
                parseFloat(customWidth) <= 10 &&
                parseFloat(customHeight) <= 10)
        const hasCustomQty = quantity !== "custom" || customQuantity
        const meetsMOQ = getQuantityCount() >= 250
        const designLimit = getQuantityCount() / 250
        const hasAllFiles =
            designFiles.length === designs && designFiles.every(Boolean)
        return (
            hasBasic &&
            hasCustomSize &&
            hasCustomQty &&
            meetsMOQ &&
            designs <= designLimit &&
            hasAllFiles
        )
    }

    {
        renderDesignUploads()
    }

    {
        (size === "custom" &&
            (parseFloat(customWidth) < 1 ||
                parseFloat(customHeight) < 1 ||
                parseFloat(customWidth) > 10 ||
                parseFloat(customHeight) > 10)) && (
            <div
                style={{
                    color: "#e11d48",
                    fontSize: "14px",
                    marginBottom: "8px",
                }}
            >
                Custom sizes must be at least 1&quot;×1&quot; and no larger than
                10&quot;×10&quot;.
            </div>
        )
    }
    <label style={labelStyle}>
        Number of Designs
        <input
            type="number"
            min={1}
            max={Math.floor(getQuantityCount() / 250)}
            value={designs}
            onChange={(e) => {
                setDesigns(Number(e.target.value))
                saveToLocalStorage({
                    designs: Number(e.target.value),
                })
            }}
            style={inputStyle}
        />
        <span style={{ fontSize: "12px", color: "#555" }}>
            You can split your order — 250 stickers per design.
        </span>
        {designs > Math.floor(getQuantityCount() / 250) && (
            <div
                style={{
                    color: "#e11d48",
                    fontSize: "14px",
                    marginTop: 4,
                }}
            >
                You can only split into{" "}
                {Math.floor(getQuantityCount() / 250)} designs.
            </div>
        )}
    </label>

    const uploadFileToUploadcare = async (file) => {
        const formData = new FormData()
        formData.append("UPLOADCARE_PUB_KEY", "3d4a30cfbedade14c918")
        formData.append("file", file)

        const res = await fetch("https://upload.uploadcare.com/base/", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        return `https://ucarecdn.com/${data.file}/`
    }

    const handleCheckout = async () => {
        if (!isFormComplete()) {
            setMissingDesignError(true)
            console.warn("Form incomplete or below minimum order quantity.")
            return
        }
        setMissingDesignError(false)

        setIsLoading(true)

        try {
            // Step 1: Upload artwork
            const uploadedURLs = await Promise.all(
                designFiles.map((file) => uploadFileToUploadcare(file))
            )
            console.log("Uploading URLs:", uploadedURLs)

            // Step 2: Build payload
            const payload = {
                data: [
                    {
                        shape,
                        type,
                        size,
                        customWidth,
                        customHeight,
                        quantity,
                        customQuantity,
                        packaging: packaging ? "Yes" : "No",
                        designs,
                        quote: calculateQuote(),
                        artworkLinks: uploadedURLs[0] || "",
                    },
                ],
            }

            // Step 3: Submit to SheetDB
            const sheetRes = await fetch(
                "https://sheetdb.io/api/v1/ebelm28bwb527",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )

            if (!sheetRes.ok) {
                console.error("Failed to submit order.")
                return
            }

            // Send notification email (independent of Stripe)
            const emailResponse = await fetch("/api/send-confirmation-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: "gian@studio-916.com",
                    subject: "New Sticker Order Submitted",
                    text: `A new sticker order has been submitted.\n\nShape: ${shape}\nType: ${type}\nSize: ${size}\nQuantity: ${quantity}\nDesigns: ${designs}\nQuote: ${calculateQuote()}`,
                }),
            })

            if (!emailResponse.ok) {
                console.error(
                    "Email failed to send:",
                    await emailResponse.text()
                )
            } else {
                console.log("Email sent successfully.")
            }

            // Step 4: Start Stripe checkout
            const amount = parseFloat(calculateQuote().replace("$", "")) * 100

            const items = [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Custom Sticker Order",
                            description: `${quantity} stickers, ${designs} design(s), ${packaging ? "with" : "no"} packaging`,
                        },
                        unit_amount: Math.round(amount),
                    },
                    quantity: 1,
                },
            ]

            const stripeRes = await fetch(
                "https://studio916-checkout.vercel.app/api/create-checkout-session",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items,
                        cancel_url: window.location.href,
                    }),
                }
            )

            const data = await stripeRes.json()

            if (data.url) {
                // Do not clear form state here; clear only after successful payment (on /thankyou page)
                window.location.href = data.url
            } else {
                console.error("Stripe checkout session failed to start.")
            }
        } catch (error) {
            console.error("Upload, SheetDB, or Stripe error:", error)
            console.error("General error during checkout process.")
        } finally {
            setCheckoutComplete(true)
            setTimeout(() => {
                setIsLoading(false)
                setCheckoutComplete(false)
            }, 4000)
        }
    }

    const dynamicContainerStyle = {
        ...containerStyle,
    }

    return (
        <motion.div
            style={dynamicContainerStyle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            tabIndex={-1}
        >
            <label style={labelStyle}>
                Sticker Shape
                <select
                    style={{
                        ...selectInputStyle,
                        color: shape === "" ? "#aaa" : "#fff",
                    }}
                    value={shape}
                    onChange={(e) => {
                        const newShape = e.target.value
                        setShape(newShape)
                        saveToLocalStorage({ shape: newShape })
                    }}
                >
                    <option value="">Select shape</option>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="die-cut">Die Cut</option>
                    <option value="kiss-cut">Kiss Cut</option>
                </select>
            </label>

            <label style={labelStyle}>
                Sticker Type
                <select
                    style={{
                        ...selectInputStyle,
                        color: type === "" ? "#aaa" : "#fff",
                    }}
                    value={type}
                    onChange={(e) => {
                        const newType = e.target.value
                        setType(newType)
                        saveToLocalStorage({ type: newType })
                    }}
                >
                    <option value="">Select type</option>
                    <option value="vinyl-matte">Matte</option>
                    <option value="vinyl-glossy">Glossy</option>
                    <option value="holographic">Holographic</option>
                    <option value="spot-uv">Spot UV</option>
                </select>
            </label>

            <label style={labelStyle}>
                Sticker Size
                <select
                    style={{
                        ...selectInputStyle,
                        color: size === "" ? "#aaa" : "#fff",
                    }}
                    value={size}
                    onChange={(e) => {
                        const newSize = e.target.value
                        setSize(newSize)
                        saveToLocalStorage({ size: newSize })
                    }}
                >
                    <option value="">Select size</option>
                    <option value="2x2">2x2"</option>
                    <option value="2.91x2.91">2.91x2.91"</option>
                    <option value="2.91x4.12">916 Standard (2.91x4.12)</option>
                    <option value="3x3">3x3"</option>
                    <option value="4x4">4x4"</option>
                    <option value="5x2">5x2"</option>
                    <option value="5x5">5x5"</option>
                    <option value="custom">Custom</option>
                </select>
            </label>

            <div
                style={{
                    display: size === "custom" ? "flex" : "none",
                    gap: "4%",
                    marginBottom: 0,
                }}
            >
                <input
                    style={halfInputStyle}
                    type="number"
                    placeholder="Width (in)"
                    value={customWidth}
                    onChange={(e) => {
                        setCustomWidth(e.target.value)
                        saveToLocalStorage({ customWidth: e.target.value })
                    }}
                />
                <input
                    style={halfInputStyle}
                    type="number"
                    placeholder="Height (in)"
                    value={customHeight}
                    onChange={(e) => {
                        setCustomHeight(e.target.value)
                        saveToLocalStorage({ customHeight: e.target.value })
                    }}
                />
            </div>
            {size === "custom" &&
              (parseFloat(customWidth) < 1 ||
                parseFloat(customHeight) < 1 ||
                parseFloat(customWidth) > 10 ||
                parseFloat(customHeight) > 10) && (
                <div
                  style={{
                    color: "#e11d48",
                    fontSize: "14px",
                    marginTop: "4px",
                    marginBottom: "8px",
                  }}
                >
                  Custom sizes must be at least 1"×1" and no larger than 10"×10".
                </div>
            )}
            <label style={labelStyle}>
                Quantity
                <div style={quantityGridStyle}>
                    {quantityOptions.map((q) => (
                        <button
                            key={q}
                            style={{
                                ...quantityButtonStyle,
                                borderColor:
                                    quantity === q.toString()
                                        ? "#009DFF"
                                        : "rgba(255,255,255,0.2)",
                                backgroundColor:
                                    quantity === q.toString()
                                        ? "rgba(0,157,255,0.15)"
                                        : "rgba(255,255,255,0.03)",
                            }}
                            onClick={() => {
                                setQuantity(q.toString())
                                saveToLocalStorage({ quantity: q.toString() })
                            }}
                        >
                            {q.toLocaleString()}
                        </button>
                    ))}

                    <button
                        style={{
                            ...quantityButtonStyle,
                            borderColor:
                                quantity === "custom"
                                    ? "#009DFF"
                                    : "rgba(255,255,255,0.2)",
                            backgroundColor:
                                quantity === "custom"
                                    ? "rgba(0,157,255,0.15)"
                                    : "rgba(255,255,255,0.03)",
                        }}
                        onClick={() => {
                            setQuantity("custom")
                            saveToLocalStorage({ quantity: "custom" })
                        }}
                    >
                        Custom
                    </button>
                </div>
                {quantity === "custom" && (
                    <input
                        style={inputStyle}
                        type="number"
                        placeholder="Enter custom quantity"
                        value={customQuantity}
                        onChange={(e) => {
                            setCustomQuantity(e.target.value)
                            saveToLocalStorage({
                                customQuantity: e.target.value,
                            })
                        }}
                    />
                )}
            </label>

            <label style={labelStyle}>
                Upload Artwork
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.ai,.pdf"
                    style={{
                        ...inputStyle,
                        padding: "10px 14px",
                        fontSize: "15px",
                    }}
                    onChange={(e) => {
                        const file = e.target.files[0]
                        setDesignFiles([file])
                        saveToLocalStorage({ designFiles: [file] })
                    }}
                />
                <span
                    style={{
                        fontSize: "12px",
                        color: "#555",
                        marginTop: 4,
                        display: "block",
                    }}
                >
                    Accepted formats: PNG, JPG, SVG, AI, PDF
                </span>
            </label>
            {missingDesignError && (
                <div
                    style={{
                        color: "#e11d48",
                        fontSize: "14px",
                        marginTop: "8px",
                    }}
                >
                    Please upload your design file before proceeding.
                </div>
            )}

            {!isFormComplete() &&
                getQuantityCount() > 0 &&
                getQuantityCount() < 250 && (
                    <div style={{ color: "#e11d48", fontSize: "14px" }}>
                        Minimum order quantity is 250 stickers.
                    </div>
                )}

            <label
                style={{
                    ...labelStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: isPackagingAllowed() ? 1 : 0.4,
                }}
            >
                <input
                    type="checkbox"
                    checked={packaging}
                    disabled={!isPackagingAllowed()}
                    onChange={(e) => {
                        setPackaging(e.target.checked)
                        saveToLocalStorage({ packaging: e.target.checked })
                    }}
                />
                Add Studio916 Packaging
            </label>

            <div
                style={{
                    fontFamily: "'Switzer', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#ffffff",
                }}
            >
                Estimated Quote: {calculateQuote()}
            </div>
            <style>
                {`
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-left: 10px;
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                `}
            </style>
            <button
                onClick={handleCheckout}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    fontFamily: "'Switzer', sans-serif",
                    fontSize: "16px",
                    padding: "12px 18px",
                    backgroundColor: isFormComplete() ? "#009DFF" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isFormComplete() ? "pointer" : "not-allowed",
                    marginTop: 10,
                    transition: "all 0.3s ease",
                    boxShadow:
                        isFormComplete() && hovered
                            ? "0 0 16px rgba(0, 157, 255, 0.1), 0 0 32px rgba(0, 157, 255, 0.1)"
                            : "none",
                }}
                disabled={!isFormComplete()}
            >
                {isLoading ? (
                    checkoutComplete ? (
                        <span className="loading-text">Redirecting...</span>
                    ) : (
                        <span className="loading-text">
                            Processing
                            <span className="loading-spinner"></span>
                        </span>
                    )
                ) : (
                    "Proceed to Checkout"
                )}
            </button>
        </motion.div>
    )
}
