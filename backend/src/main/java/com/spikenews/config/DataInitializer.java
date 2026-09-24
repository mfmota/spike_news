package com.spikenews.config;

import com.spikenews.model.*;
import com.spikenews.repository.MatchRepository;
import com.spikenews.repository.NewsRepository;
import com.spikenews.repository.TeamRepository;
import com.spikenews.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final NewsRepository newsRepository;
    private final MatchRepository matchRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            TeamRepository teamRepository,
            NewsRepository newsRepository,
            MatchRepository matchRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.newsRepository = newsRepository;
        this.matchRepository = matchRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Criando usuários padrão...");

            User admin = new User("Admin Spike", "admin@spikenews.gg", passwordEncoder.encode("admin123"), Role.ADMIN);
            User journalist = new User("Jornalista Valorant", "jornalista@spikenews.gg", passwordEncoder.encode("jornalista123"), Role.JORNALISTA);
            User user = new User("Player Fã", "user@spikenews.gg", passwordEncoder.encode("user123"), Role.USER);

            userRepository.save(admin);
            userRepository.save(journalist);
            userRepository.save(user);

            logger.info("Criando times padrão...");
            Team loud = teamRepository.save(new Team("LOUD", "https://owcdn.net/img/62a26569ecf20.png", "loud"));
            Team sentinels = teamRepository.save(new Team("Sentinels", "https://owcdn.net/img/62a2679dc6e86.png", "sen"));
            Team fnatic = teamRepository.save(new Team("Fnatic", "https://owcdn.net/img/62a268a7ecf20.png", "fnc"));
            Team prx = teamRepository.save(new Team("Paper Rex", "https://owcdn.net/img/62a2690cecf20.png", "prx"));

            logger.info("Criando notícias de exemplo...");
            newsRepository.save(new News(
                    "VCT Americas: LOUD estreia com vitória emocionante sobre a Sentinels",
                    "Em uma série disputadíssima decidida no terceiro mapa (Haven), a LOUD mostrou superioridade tática e garantiu seus primeiros pontos na temporada do VCT Americas com grande atuação individual.",
                    journalist,
                    loud
            ));

            newsRepository.save(new News(
                    "Novo Agente e Atualização de Balanceamento chegam ao VALORANT",
                    "A Riot Games anunciou as novas mudanças do patch de balanceamento, incluindo ajustes nas habilidades de duelistas e melhorias no desempenho dos mapas competitivos.",
                    journalist,
                    null
            ));

            logger.info("Criando partida ao vivo inicial...");
            matchRepository.save(new Match(
                    loud,
                    sentinels,
                    12,
                    11,
                    MatchStatus.AO_VIVO,
                    "VCT Americas - Rodada 1",
                    LocalDateTime.now()
            ));

            logger.info("Carga inicial de dados concluída com sucesso!");
        }
    }
}
