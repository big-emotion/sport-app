<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250511224937 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE event (id UUID NOT NULL, sport_place_id UUID NOT NULL, organizer_id UUID NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, event_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_3BAE0AA73B045DA3 ON event (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_3BAE0AA7876C4DDA ON event (organizer_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN event.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN event.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN event.organizer_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN event.event_date IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN event.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE favorite (id UUID NOT NULL, user_id UUID NOT NULL, sport_place_id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_68C58ED9A76ED395 ON favorite (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_68C58ED93B045DA3 ON favorite (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN favorite.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN favorite.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN favorite.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN favorite.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE forum_post (id UUID NOT NULL, user_id UUID NOT NULL, sport_place_id UUID NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_996BCC5AA76ED395 ON forum_post (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_996BCC5A3B045DA3 ON forum_post (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_post.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_post.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_post.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_post.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE forum_reply (id UUID NOT NULL, user_id UUID NOT NULL, forum_post_id UUID NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_E5DC6037A76ED395 ON forum_reply (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_E5DC6037BA454E5D ON forum_reply (forum_post_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_reply.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_reply.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_reply.forum_post_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN forum_reply.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE itinerary (id UUID NOT NULL, user_id UUID NOT NULL, destination_place_id UUID NOT NULL, start_latitude DOUBLE PRECISION NOT NULL, start_longitude DOUBLE PRECISION NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_FF2238F6A76ED395 ON itinerary (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_FF2238F653166228 ON itinerary (destination_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN itinerary.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN itinerary.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN itinerary.destination_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN itinerary.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE media (id UUID NOT NULL, sport_place_id UUID NOT NULL, uploaded_by_id UUID DEFAULT NULL, url VARCHAR(255) NOT NULL, type VARCHAR(10) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_6A2CA10C3B045DA3 ON media (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_6A2CA10CA2B28FE8 ON media (uploaded_by_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN media.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN media.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN media.uploaded_by_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN media.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notification (id UUID NOT NULL, user_id UUID NOT NULL, type VARCHAR(20) NOT NULL, content TEXT NOT NULL, is_read BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CAA76ED395 ON notification (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN notification.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN notification.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN notification.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE review (id UUID NOT NULL, user_id UUID NOT NULL, sport_place_id UUID NOT NULL, rating INT NOT NULL, comment TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_794381C6A76ED395 ON review (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_794381C63B045DA3 ON review (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN review.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN review.user_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN review.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN review.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE sport (id UUID NOT NULL, name VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, icon_url VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE sport_place (id UUID NOT NULL, created_by_id UUID DEFAULT NULL, name VARCHAR(255) NOT NULL, description TEXT NOT NULL, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, address VARCHAR(255) NOT NULL, opening_hours JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C06132D4B03A8386 ON sport_place (created_by_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place.created_by_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place.updated_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE sport_place_sport (sport_place_id UUID NOT NULL, sport_id UUID NOT NULL, PRIMARY KEY(sport_place_id, sport_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_D0C6B0B73B045DA3 ON sport_place_sport (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_D0C6B0B7AC78BCF8 ON sport_place_sport (sport_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place_sport.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN sport_place_sport.sport_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE usage_statistics (id UUID NOT NULL, sport_place_id UUID NOT NULL, views INT NOT NULL, visit_count INT NOT NULL, last_visited TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_6619F6783B045DA3 ON usage_statistics (sport_place_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN usage_statistics.id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN usage_statistics.sport_place_id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN usage_statistics.last_visited IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE "user" (id UUID NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, avatar_url VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "user".id IS '(DC2Type:uuid)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "user".created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "user".updated_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA73B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7876C4DDA FOREIGN KEY (organizer_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED9A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED93B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_post ADD CONSTRAINT FK_996BCC5AA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_post ADD CONSTRAINT FK_996BCC5A3B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_reply ADD CONSTRAINT FK_E5DC6037A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_reply ADD CONSTRAINT FK_E5DC6037BA454E5D FOREIGN KEY (forum_post_id) REFERENCES forum_post (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE itinerary ADD CONSTRAINT FK_FF2238F6A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE itinerary ADD CONSTRAINT FK_FF2238F653166228 FOREIGN KEY (destination_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media ADD CONSTRAINT FK_6A2CA10C3B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CA2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C6A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C63B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place ADD CONSTRAINT FK_C06132D4B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place_sport ADD CONSTRAINT FK_D0C6B0B73B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place_sport ADD CONSTRAINT FK_D0C6B0B7AC78BCF8 FOREIGN KEY (sport_id) REFERENCES sport (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE usage_statistics ADD CONSTRAINT FK_6619F6783B045DA3 FOREIGN KEY (sport_place_id) REFERENCES sport_place (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA73B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA7876C4DDA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorite DROP CONSTRAINT FK_68C58ED9A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorite DROP CONSTRAINT FK_68C58ED93B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_post DROP CONSTRAINT FK_996BCC5AA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_post DROP CONSTRAINT FK_996BCC5A3B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_reply DROP CONSTRAINT FK_E5DC6037A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE forum_reply DROP CONSTRAINT FK_E5DC6037BA454E5D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE itinerary DROP CONSTRAINT FK_FF2238F6A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE itinerary DROP CONSTRAINT FK_FF2238F653166228
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media DROP CONSTRAINT FK_6A2CA10C3B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media DROP CONSTRAINT FK_6A2CA10CA2B28FE8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CAA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP CONSTRAINT FK_794381C6A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP CONSTRAINT FK_794381C63B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place DROP CONSTRAINT FK_C06132D4B03A8386
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place_sport DROP CONSTRAINT FK_D0C6B0B73B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sport_place_sport DROP CONSTRAINT FK_D0C6B0B7AC78BCF8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE usage_statistics DROP CONSTRAINT FK_6619F6783B045DA3
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE event
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE favorite
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE forum_post
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE forum_reply
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE itinerary
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE media
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notification
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE review
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE sport
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE sport_place
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE sport_place_sport
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE usage_statistics
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE "user"
        SQL);
    }
}
