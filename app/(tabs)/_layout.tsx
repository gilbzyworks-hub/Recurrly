import { Tabs } from "expo-router";
import { tabs } from "@/constants/data";
import { View } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
        <View className="tabs-icon">
            <View className={clsx("tabs-pill", focused && "tabs-active")}>
                <Image
                    source={icon}
                    className="tabs-glyph"
                    contentFit="contain"
                    tintColor={focused ? "#ffffff" : "#9ca3af"}
                />
            </View>
        </View>
    );
};

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
};

export default TabLayout;
