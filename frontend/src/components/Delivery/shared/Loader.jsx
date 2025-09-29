export default function Loader({ className = "" }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
    );
}
