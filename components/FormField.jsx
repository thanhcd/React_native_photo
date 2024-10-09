import { View, Text, TextInput, Image } from "react-native";
import React, {useState} from "react";
import { TouchableOpacity } from "react-native";
import { icons } from '../constants'


const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-cregular">{title}</Text>
      <View className="w-full h-16 px-4 bg-white border-[2px] border-grey focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-base font-cregular"
          value={value}
          placeholder={placeholder}
          placeholderTextColor=""
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />
        {title ==='Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                    source={!showPassword ? icons.eye : icons.eyeHide} 
                    className="w-6 h-6"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
