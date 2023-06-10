interface ImageProps {
  src: string;
  description: string;
}
const Image = ({ src, description }: ImageProps) => {
  return (
    <div>
      <img src={src} alt={description} style={{ width: "100%" }} />
    </div>
  );
};

export default Image;
