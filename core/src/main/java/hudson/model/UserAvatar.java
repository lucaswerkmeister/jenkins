package hudson.model;

import org.kohsuke.stapler.export.Exported;
import org.kohsuke.stapler.export.ExportedBean;

import java.util.*;
import java.util.stream.Collectors;

@ExportedBean
public class UserAvatar {
    @Exported
    String initials;
    @Exported
    String primaryColor;
    @Exported
    String secondaryColor;
    @Exported
    int angle;

    private static final List<String> primaryColors = Arrays.asList("orange",
            "red", "green", "blue", "pink", "brown", "cyan", "indigo", "yellow", "purple");
    private static final List<String> secondaryColors = new ArrayList<>(primaryColors);

    static {
        Collections.reverse(secondaryColors);
    }

    private static long stringToSeed(String s) {
        if (s == null) {
            return 0;
        }
        long hash = 0;
        for (char c : s.toCharArray()) {
            hash = 31L*hash + c;
        }
        return hash;
    }

    private UserAvatar() {}

    public static UserAvatar fromFullname(String fullName) {
        Random random = new Random(stringToSeed(fullName));
        UserAvatar userAvatar = new UserAvatar();
        userAvatar.setInitials(Arrays.stream(fullName.split(" "))
                .map(e -> String.valueOf(e.charAt(0))).collect(Collectors.joining()));
        userAvatar.setPrimaryColor(primaryColors.get(random.nextInt(primaryColors.size())));
        userAvatar.setSecondaryColor(secondaryColors.get(random.nextInt(secondaryColors.size())));
        userAvatar.setAngle(random.nextInt(360));
        return userAvatar;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public int getAngle() {
        return angle;
    }

    public void setAngle(int angle) {
        this.angle = angle;
    }
}
