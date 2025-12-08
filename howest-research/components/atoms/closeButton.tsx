import Touchable from './touchable';

const CloseButton = ({ onPress, children }: { onPress: () => void, children: React.ReactNode }) => {
    return (
        <Touchable onPress={onPress} isActive={true} icon={'close'} styleGradient={{ alignSelf: 'center' }}>{children}</Touchable>
    )
}

export default CloseButton