import LottieView from 'lottie-react-native';


const Animation = ({ onFinish }) => {
  return (
    <LottieView
      style={{
        position: 'absolute', // 애니메이션을 다른 요소들 위에 위치시킵니다.
        top: 0,               // 상단에서의 위치
        left: 0,              // 왼쪽에서의 위치
        right: 0,             // 오른쪽에서의 위치
        bottom: 0,            // 하단에서의 위치
        width: '100%',        // 화면의 너비를 100%로 설정합니다.
        height: '100%',       // 화면의 높이를 100%로 설정합니다.
        backgroundColor: 'transparent' // 배경을 투명하게 설정합니다.
      }}
      source={require('./Animation.json')}
      autoPlay
      loop={true}
      onAnimationFinish={onFinish}
    />
  );
};
export default Animation;