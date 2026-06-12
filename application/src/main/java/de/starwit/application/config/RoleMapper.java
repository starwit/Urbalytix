package de.starwit.application.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    @Value("${security.rolemapping.admin:visualizer_admin}")
    String adminRoleName;

    @Value("${security.rolemapping.user:visualizer_user}")
    String userRoleName;

    @Value("${security.rolemapping.reader:visualizer_reader}")
    String readerRoleName;

    public List<String> mapAllRoles(List<String> externalRoles) {
        return externalRoles.stream().map(this::mapRole).toList();
    }

    private String mapRole(String externalRole) {
        if (externalRole.equals(adminRoleName)) {
            return "admin";
        } else if (externalRole.equals(userRoleName)) {
            return "user";
        } else if (externalRole.equals(readerRoleName)) {
            return "reader";
        } else {
            return externalRole;
        }
    }
}
