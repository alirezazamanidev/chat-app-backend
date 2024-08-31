import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1725125307771 implements MigrationInterface {
    name = 'NewMigration1725125307771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`senderId\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, \`roomId\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NULL, \`type\` varchar(255) NOT NULL, \`createdById\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_535c742a3606d2e3122f441b26\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`fullname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`phone_verify\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`otpId\` varchar(255) NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), UNIQUE INDEX \`REL_483a6adaf636e520039e97ef61\` (\`otpId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_otp\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`expiresIn\` datetime NOT NULL, \`userId\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_bd81461d078fe46743dd535fb2\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roomParticipantsUser\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`roomId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`, \`userId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`connected_user\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`socketId\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`roomId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`roomId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`roomId\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`roomId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`id\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`id\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`userId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`id\`, \`roomId\`, \`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_ba1dadfd0f9b98a9ef0970c32e\` ON \`roomParticipantsUser\` (\`roomId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_da85ef0e13208579b513b4ecf4\` ON \`roomParticipantsUser\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_fdfe54a21d1542c564384b74d5c\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room\` ADD CONSTRAINT \`FK_0468c843ad48d3455e48d40ddd4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_483a6adaf636e520039e97ef617\` FOREIGN KEY (\`otpId\`) REFERENCES \`user_otp\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_otp\` ADD CONSTRAINT \`FK_bd81461d078fe46743dd535fb27\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD CONSTRAINT \`FK_ba1dadfd0f9b98a9ef0970c32ed\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD CONSTRAINT \`FK_da85ef0e13208579b513b4ecf4d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP FOREIGN KEY \`FK_da85ef0e13208579b513b4ecf4d\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP FOREIGN KEY \`FK_ba1dadfd0f9b98a9ef0970c32ed\``);
        await queryRunner.query(`ALTER TABLE \`user_otp\` DROP FOREIGN KEY \`FK_bd81461d078fe46743dd535fb27\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_483a6adaf636e520039e97ef617\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP FOREIGN KEY \`FK_0468c843ad48d3455e48d40ddd4\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_fdfe54a21d1542c564384b74d5c\``);
        await queryRunner.query(`DROP INDEX \`IDX_da85ef0e13208579b513b4ecf4\` ON \`roomParticipantsUser\``);
        await queryRunner.query(`DROP INDEX \`IDX_ba1dadfd0f9b98a9ef0970c32e\` ON \`roomParticipantsUser\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`id\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`id\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`roomId\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`roomId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`roomId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`roomId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`userId\`, \`roomId\`)`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`roomParticipantsUser\` ADD PRIMARY KEY (\`id\`, \`userId\`, \`roomId\`)`);
        await queryRunner.query(`DROP TABLE \`connected_user\``);
        await queryRunner.query(`DROP TABLE \`roomParticipantsUser\``);
        await queryRunner.query(`DROP INDEX \`REL_bd81461d078fe46743dd535fb2\` ON \`user_otp\``);
        await queryRunner.query(`DROP TABLE \`user_otp\``);
        await queryRunner.query(`DROP INDEX \`REL_483a6adaf636e520039e97ef61\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_535c742a3606d2e3122f441b26\` ON \`room\``);
        await queryRunner.query(`DROP TABLE \`room\``);
        await queryRunner.query(`DROP TABLE \`message\``);
    }

}
